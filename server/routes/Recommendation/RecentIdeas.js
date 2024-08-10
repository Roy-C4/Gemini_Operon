const router = require("express").Router();
const pool = require("../../db");
const auth = require("../../middlewares/Auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const uuid = require("uuid");

/// MATCHED USERS \\\
router.get("/recusers", auth, async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT MS.USERIMAGE AS MATCHEDUSERIMAGE,MS.USERNAME AS RECOMMENDEDUSER,MS.USERID AS RECOMMENDEDUSERID,TR.USERSRL AS POSTEDUSERSRL,MU.USERNAME AS POSTEDUSER,MS.USERSRL FROM T_RECOMMENDATIONS TR JOIN T_IDEAS TI ON TR.IDEAID = TI.IDEAID JOIN M_USER MU ON TR.USERSRL=MU.USERSRL JOIN M_USER MS ON TI.USERSRL=MS.USERSRL WHERE MU.usersrl=$1 AND MS.USERSRL NOT IN (SELECT SENTTO FROM T_COLLABREQUEST WHERE SENTFROM=$1) GROUP BY MATCHEDUSERIMAGE,RECOMMENDEDUSER,POSTEDUSERSRL,POSTEDUSER,RECOMMENDEDUSERID,ms.usersrl",
      [req.user]
    );
    res.json(data.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//recommendations
// router.get("/recommemdations", auth, async (req, res) => {
//   try {
//     // Query to get recommendations data
//     const recommendationsData = await pool.query(
//       `SELECT
//          TI.USERSRL AS RECOMMENDEDUSERSRL,
//          MS.USERNAME AS RECOMMENDEDUSER,
//          TI.TITLE,
//          TI.GIST,
//          TI.DESCRIPTION,
//          TR.SCORE,
//          TI.CATEGORYARRAY,
//          BC.CATGNAME,
//          TR.IDEAID,
//          CASE WHEN TI.IDEAID IN (SELECT IDEAID FROM T_RATING) THEN TRUE ELSE FALSE END AS LIKEDFLAG
//        FROM
//          T_RECOMMENDATIONS TR
//          JOIN T_IDEAS TI ON TR.IDEAID = TI.IDEAID
//          JOIN M_USER MU ON TR.USERSRL = MU.USERSRL
//          JOIN M_USER MS ON TI.USERSRL = MS.USERSRL
//          JOIN M_BIZCATEGORY BC ON TI.CATEGORYARRAY @> ARRAY[BC.CATGID]
//          LEFT JOIN T_RATING TRA ON TI.IDEAID = TRA.IDEAID
//        WHERE
//          MU.USERSRL = $1
//          AND TRA.DISLIKEDUSERID IS NULL
//          AND TRA.LIKEDUSERID IS NULL`,
//       [req.user]
//     );

//     // Query to get ratings data
//     const ratingsData = await pool.query(
//       `SELECT
//          r.IDEAID,
//          r.noofreviews,
//          COALESCE(p.positivereview, 0) AS positivereview,
//          ROUND((COALESCE(p.positivereview, 0) * 5.0 / r.noofreviews), 1) AS rating_out_of_5
//        FROM
//          (SELECT IDEAID, COUNT(*) AS noofreviews FROM T_RATING GROUP BY IDEAID) r
//        LEFT JOIN
//          (SELECT IDEAID, COUNT(*) AS positivereview FROM T_RATING WHERE likeduserid IS NOT NULL GROUP BY IDEAID) p
//        ON r.IDEAID = p.IDEAID`
//     );
//     //console.log(ratingsData.rows);
//     // Convert ratingsData to a map for quick lookup
//     const ratingsMap = {};
//     ratingsData.rows.forEach((rating) => {
//       ratingsMap[rating.ideaid] = {
//         noofreviews: rating.noofreviews,
//         positivereview: rating.positivereview,
//         rating_out_of_5: rating.rating_out_of_5,
//       };
//     });

//     // Merge recommendations data with ratings data
//     const uniqueIdeas = {};

//     recommendationsData.rows.forEach((item) => {
//       if (!uniqueIdeas[item.ideaid]) {
//         uniqueIdeas[item.ideaid] = {
//           recommendedusersrl: item.recommendedusersrl,
//           recommendeduser: item.recommendeduser,
//           description: item.description,
//           ideaid: item.ideaid,
//           gist: item.gist,
//           title: item.title,
//           score: item.score,
//           likedflag: item.likedflag,
//           category: [],
//           rating_out_of_5: ratingsMap[item.ideaid]
//             ? ratingsMap[item.ideaid].rating_out_of_5
//             : 0,
//         };
//       }
//       uniqueIdeas[item.ideaid].category.push({
//         catgid: item.catgid,
//         catgname: item.catgname,
//       });
//     });

//     const result = Object.values(uniqueIdeas);
//     console.log(result);
//     res.json(result);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error!");
//   }
// });
router.get("/recommemdations", auth, async (req, res) => {
  try {
    // Query to get recommendations data
    const recommendationsData = await pool.query(
      `SELECT 
         TI.USERSRL AS RECOMMENDEDUSERSRL,
         MS.USERNAME AS RECOMMENDEDUSER,
         TI.TITLE,
         TI.GIST,
         TI.FILE1,
         TI.FILE2,
         TI.FILE1NAME,
         TI.FILE2NAME,
         TI.FILE1MIMETYPE,
         TI.FILE2MIMETYPE,
         TI.DESCRIPTION,
         TR.SCORE,
         jsonb_agg(jsonb_build_object('catgid', BC.CATGID, 'catgname', BC.CATGNAME)) AS category,
         TR.IDEAID,
         0 as rating_out_of_5,
         CASE WHEN TI.IDEAID IN (SELECT IDEAID FROM T_RATING WHERE likeduserid=$1) THEN TRUE ELSE FALSE END AS LIKEDFLAG
       FROM 
         T_RECOMMENDATIONS TR 
         JOIN T_IDEAS TI ON TR.IDEAID = TI.IDEAID 
         JOIN M_USER MU ON TR.USERSRL = MU.USERSRL 
         JOIN M_USER MS ON TI.USERSRL = MS.USERSRL 
         JOIN M_BIZCATEGORY BC ON BC.CATGID = ANY(TI.CATEGORYARRAY)
         LEFT JOIN T_RATING TRA ON TI.IDEAID = TRA.IDEAID 
       WHERE 
         MU.USERSRL = $1 
         AND (TRA.LIKEDUSERID != $1 OR TRA.LIKEDUSERID IS NULL)
         AND (TRA.DISLIKEDUSERID != $1 OR TRA.DISLIKEDUSERID IS NULL)
       GROUP BY
         TI.USERSRL,
         MS.USERNAME,
         TI.TITLE,
         TI.GIST,
         TI.FILE1,
         TI.FILE2,
         TI.FILE1NAME,
         TI.FILE2NAME,
         TI.FILE1MIMETYPE,
         TI.FILE2MIMETYPE,
         TI.DESCRIPTION,
         TR.SCORE,
         TR.IDEAID,
         LIKEDFLAG`,
      [req.user]
    );
    const result = recommendationsData.rows;
    for (let i = 0; i < result.length; i++) {
      const ratingData = await pool.query(
        "SELECT ROUND((COALESCE(p.positivereview, 0) * 5.0 / r.noofreviews), 1) AS rating FROM (SELECT IDEAID, COUNT(*) AS noofreviews FROM T_RATING GROUP BY IDEAID) r LEFT JOIN (SELECT IDEAID, COUNT(*) AS positivereview FROM T_RATING WHERE likeduserid IS NOT NULL GROUP BY IDEAID) p ON r.IDEAID = p.IDEAID WHERE r.ideaid=$1",
        [result[i].ideaid]
      );
      // console.log("loop", i, "data", result[i].ideaid);
      // console.log(ratingData.rows);
      if (ratingData.rows.length > 0) {
        // Merge rating data into result[i]
        result[i].rating_out_of_5 = ratingData.rows[0].rating;
      } else {
        // Merge rating data into result[i]
        result[i].rating_out_of_5 = 0;
      }
    }
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//liked posts
router.get("/likedposts", auth, async (req, res) => {
  try {
    const data = await pool.query(
      `SELECT 
         TI.USERSRL AS POSTEDBYUSERSRL,
         MS.USERIMAGE,
          MS.USERID,
         MS.USERNAME AS POSTEDBY,
         TI.TITLE,
         TI.GIST,
              TI.FILE1,
         TI.FILE2,
         TI.FILE1NAME,
         TI.FILE2NAME,
         TI.FILE1MIMETYPE,
         TI.FILE2MIMETYPE,
         TI.DESCRIPTION,
         TI.CATEGORYARRAY,
         0 as rating_out_of_5,
         jsonb_agg(jsonb_build_object('catgid', BC.CATGID, 'catgname', BC.CATGNAME)) AS category,
         TI.ideaid
       FROM 
         T_IDEAS TI 
       LEFT JOIN 
         M_USER MU ON TI.USERSRL = MU.USERSRL 
       LEFT JOIN 
         M_USER MS ON TI.USERSRL = MS.USERSRL 
       LEFT JOIN 
         T_RATING TRT ON TI.IDEAID = TRT.IDEAID 
        LEFT JOIN M_BIZCATEGORY BC ON BC.CATGID = ANY(TI.CATEGORYARRAY)
       WHERE 
         TRT.LIKEDUSERID = $1
         GROUP BY
         TI.USERSRL, 
         MS.USERIMAGE, 
         MS.USERNAME,
           MS.USERID, 
         TI.TITLE, 
         TI.GIST,     
         TI.FILE1,
         TI.FILE2,
         TI.FILE1NAME,
         TI.FILE2NAME,
         TI.FILE1MIMETYPE,
         TI.FILE2MIMETYPE, TI.DESCRIPTION, TI.CATEGORYARRAY,TI.ideaid`,
      [req.user]
    );
    const result = data.rows;
    for (let i = 0; i < result.length; i++) {
      const ratingData = await pool.query(
        "SELECT ROUND((COALESCE(p.positivereview, 0) * 5.0 / r.noofreviews), 1) AS rating FROM (SELECT IDEAID, COUNT(*) AS noofreviews FROM T_RATING GROUP BY IDEAID) r LEFT JOIN (SELECT IDEAID, COUNT(*) AS positivereview FROM T_RATING WHERE likeduserid IS NOT NULL GROUP BY IDEAID) p ON r.IDEAID = p.IDEAID WHERE r.ideaid=$1",
        [result[i].ideaid]
      );
      // console.log("loop", i, "data", result[i].ideaid);
      // console.log(ratingData.rows);
      if (ratingData.rows.length > 0) {
        // Merge rating data into result[i]
        result[i].rating_out_of_5 = ratingData.rows[0].rating;
      } else {
        // Merge rating data into result[i]
        result[i].rating_out_of_5 = 0;
      }
    }
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

//FEED
// router.get("/feed", auth, async (req, res) => {
//   try {
//     const data = await pool.query(
//       `SELECT
//     MU.USERSRL,
//     MU.USERID,
//     MU.USERIMAGE,
//     MU.USERNAME,
//     TI.IDEAID,
//     TI.TITLE,
//     TI.GIST,
//          TI.FILE1,
//          TI.FILE2,
//          TI.FILE1NAME,
//          TI.FILE2NAME,
//          TI.FILE1MIMETYPE,
//          TI.FILE2MIMETYPE,
//     TI.DESCRIPTION,
//     TI.categoryarray,
//     0 as rating_out_of_5,
//     jsonb_agg(jsonb_build_object('catgid', BC.CATGID, 'catgname', BC.CATGNAME)) AS category,
//     CASE WHEN TI.IDEAID IN (SELECT IDEAID FROM T_RATING) THEN TRUE ELSE FALSE END AS LIKEDFLAG
// FROM
//     T_IDEAS TI
//     TABLESAMPLE BERNOULLI (25)
// LEFT JOIN
//     M_USER MU ON TI.USERSRL = MU.USERSRL
// JOIN
//     M_BIZCATEGORY BC ON BC.CATGID = ANY(TI.CATEGORYARRAY)
// WHERE
//     MU.USERSRL != $1
// GROUP BY
//     MU.USERSRL,
//      MU.USERID,
//     MU.USERIMAGE,
//     MU.USERNAME,
//     TI.IDEAID,
//     TI.TITLE,
//     TI.GIST,
//          TI.FILE1,
//          TI.FILE2,
//          TI.FILE1NAME,
//          TI.FILE2NAME,
//          TI.FILE1MIMETYPE,
//          TI.FILE2MIMETYPE,
//     TI.DESCRIPTION,
//     TI.categoryarray,
//     LIKEDFLAG;
// `,
//       [req.user]
//     );
//     const result = data.rows;
//     for (let i = 0; i < result.length; i++) {
//       const ratingData = await pool.query(
//         "SELECT ROUND((COALESCE(p.positivereview, 0) * 5.0 / r.noofreviews), 1) AS rating FROM (SELECT IDEAID, COUNT(*) AS noofreviews FROM T_RATING GROUP BY IDEAID) r LEFT JOIN (SELECT IDEAID, COUNT(*) AS positivereview FROM T_RATING WHERE likeduserid IS NOT NULL GROUP BY IDEAID) p ON r.IDEAID = p.IDEAID WHERE r.ideaid=$1",
//         [result[i].ideaid]
//       );
//       console.log("loop", i, "data", result[i].ideaid);
//       console.log(ratingData.rows);
//       if (ratingData.rows.length > 0) {
//         // Merge rating data into result[i]
//         result[i].rating_out_of_5 = ratingData.rows[0].rating;
//       } else {
//         // Merge rating data into result[i]
//         result[i].rating_out_of_5 = 0;
//       }
//     }
//     res.json(result);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error!");
//   }
// });
//FEED INFINITE LOAD
router.get("/feed", auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  console.log(page);
  const limit = 10;
  const offset = (page - 1) * limit;
  try {
    const data = await pool.query(
      `SELECT
    MU.USERSRL,
    MU.USERID,
    MU.USERIMAGE,
    MU.USERNAME,
    TI.IDEAID,
    TI.TITLE,
    TI.GIST,
         TI.FILE1,
         TI.FILE2,
         TI.FILE1NAME,
         TI.FILE2NAME,
         TI.FILE1MIMETYPE,
         TI.FILE2MIMETYPE,
    TI.DESCRIPTION,
    TI.categoryarray,
    0 as rating_out_of_5,
    jsonb_agg(jsonb_build_object('catgid', BC.CATGID, 'catgname', BC.CATGNAME)) AS category,
    CASE WHEN TI.IDEAID IN (SELECT IDEAID FROM T_RATING) THEN TRUE ELSE FALSE END AS LIKEDFLAG
FROM
    T_IDEAS TI
LEFT JOIN
    M_USER MU ON TI.USERSRL = MU.USERSRL
LEFT JOIN
    M_BIZCATEGORY BC ON BC.CATGID = ANY(TI.CATEGORYARRAY)
WHERE
    MU.USERSRL != $1
GROUP BY
    MU.USERSRL,
     MU.USERID,
    MU.USERIMAGE,
    MU.USERNAME,
    TI.IDEAID,
    TI.TITLE,
    TI.GIST,
         TI.FILE1,
         TI.FILE2,
         TI.FILE1NAME,
         TI.FILE2NAME,
         TI.FILE1MIMETYPE,
         TI.FILE2MIMETYPE,
    TI.DESCRIPTION,
    TI.categoryarray,
      TI.IDEASRL,
    LIKEDFLAG
  ORDER BY 
  TI.IDEASRL
  LIMIT $2
  OFFSET $3
`,
      [req.user, limit, offset]
    );
    const result = data.rows;
    for (let i = 0; i < result.length; i++) {
      const ratingData = await pool.query(
        "SELECT ROUND((COALESCE(p.positivereview, 0) * 5.0 / r.noofreviews), 1) AS rating FROM (SELECT IDEAID, COUNT(*) AS noofreviews FROM T_RATING GROUP BY IDEAID) r LEFT JOIN (SELECT IDEAID, COUNT(*) AS positivereview FROM T_RATING WHERE likeduserid IS NOT NULL GROUP BY IDEAID) p ON r.IDEAID = p.IDEAID WHERE r.ideaid=$1",
        [result[i].ideaid]
      );
      // console.log("loop", i, "data", result[i].ideaid);
      // console.log(ratingData.rows);
      if (ratingData.rows.length > 0) {
        // Merge rating data into result[i]
        result[i].rating_out_of_5 = ratingData.rows[0].rating;
      } else {
        // Merge rating data into result[i]
        result[i].rating_out_of_5 = 0;
      }
    }
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

//EXPLAIN IMAGE IDEA
router.post("/explain/image", auth, async (req, res) => {
  try {
    const { imagedata, imagemime } = req.body;
    console.log(req.body);
    function fileToGenerativePart(image, mimeType) {
      return {
        inlineData: {
          data: Buffer.from(image).toString("base64"),
          mimeType,
        },
      };
    }
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const prompt = "Explain the image in detail.";

    const imageParts = [fileToGenerativePart(imagedata, imagemime)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    res.json({ type: "success", content: text });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
module.exports = router;
