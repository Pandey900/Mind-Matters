const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.PAYMENT_SECRET);
const jwt = require("jsonwebtoken");
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Verify Token
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ASSESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

// MongoDB Connection
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  Transaction,
} = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@yoga-master.30hzxy2.mongodb.net/?retryWrites=true&w=majority&appName=yoga-master`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Creating database and collection
    const database = client.db("yoga-master");
    const usersCollections = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payment");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    // Routes For Users
    app.post("/api/set-token", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ASSESS_SECRET, {
        expiresIn: "24h",
      });
      res.send({ token });
    });
    // Middleware For Admin And Instructor
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      if (user.role === "admin") {
        next();
      } else {
        return res.status(401).send({ message: "Unauthorized Access" });
      }
    };

    const verifyInstructor = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      if (user.role === "instructor") {
        next();
      } else {
        return res.status(401).send({ message: "Unauthorized Access" });
      }
    };

    app.post("/new-user", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollections.insertOne(newUser);
      res.send(result);
    });

    // Get The USers
    app.get("/users", async (req, res) => {
      const result = await usersCollections.find({}).toArray();
      res.send(result);
    });

    // Get Users By Id
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollections.findOne(query);
      res.send(result);
    });

    // Get USer By Email
    app.get("/user/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollections.findOne(query);
      res.send(result);
    });

    // Delete an USer
    app.delete("/delete-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollections.deleteOne(query);
      res.send(result);
    });

    // Updata Users
    app.put("/update-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.options,
          address: updatedUser.address,
          about: updatedUser.about,
          photourl: updatedUser.photourl,
          skills: updatedUser.skills ? updatedUser.skills : null,
          phone: updatedUser.phone,
        },
      };
      const result = await usersCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Classes Routes Here
    app.post("/new-class", verifyJWT, verifyInstructor, async (req, res) => {
      const newClass = req.body;
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const query = { status: "active" };
      const result = await classesCollection.find().toArray();
      res.send(result);
    });

    // Get Classes By Instructor Email
    app.get(
      "/classes/:email",
      verifyJWT,
      verifyInstructor,
      async (req, res) => {
        const email = req.params.email;
        const query = { instructoremail: email };
        const result = await classesCollection.find(query).toArray();
        res.send(result);
      }
    );

    // Manage Classes
    app.get("/classes-manage", async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    });

    // Update Classes status and reason
    app.patch(
      "/change-status/:id",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const status = req.body.status;
        const reason = req.body.reason;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: status,
            reason: reason,
          },
        };
        const result = await classesCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      }
    );
    // Get Active Class
    app.get("/active-classes", async (req, res) => {
      const query = { status: "active" };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    // Get Single Class Details
    app.get("/class/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollection.findOne(query);
      res.send(result);
    });

    // Update Class Details
    app.put(
      "/update-class/:id",
      verifyJWT,
      verifyInstructor,
      async (req, res) => {
        const id = req.params.id;
        const updateClass = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name: updateClass.name,
            image: updateClass.image,
            availableseats: updateClass.availableseats,
            price: updateClass.price,
            videolink: updateClass.videolink,
            discription: updateClass.discription,
            instructorname: updateClass.instructorname,
            status: updateClass.status,
            submitted: updateClass.submitted,
            totalenrolled: updateClass.totalenrolled,
            reason: updateClass.reason,
          },
        };
        const result = await classesCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      }
    );

    // Delete Items by ID, Name, Status, or Reason
    app.delete("/delete-item/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await classesCollection.deleteOne(filter);
      res.send(result);
    });

    // CART COLLECTIONS!------
    app.post("/add-to-cart", verifyJWT, async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);
    });

    // Get Cart Items By Id
    app.get("/cart-item/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;
      const query = {
        classId: id,
        userMail: email,
      };
      const projection = { classId: 1 };
      const result = await cartCollection.findOne(query, {
        projection: projection,
      });
      res.send(result);
    });

    // Cart info By user email
    app.get("/cart/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const projection = { classId: 1 };
      const carts = await cartCollection
        .find(query, { projection: projection })
        .toArray();
      const classIds = carts.map((cart) => new ObjectId(cart.classId));
      const query2 = { _id: { $in: classIds } };
      const result = await cartCollection.find(query2).toArray();
      res.send(result);
    });

    app.delete("/clear-cart/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartCollection.deleteMany(query);
      res.send(result);
    });

    // Delete Cart Item By Object Id
    app.delete(
      "/delete-cart-item-objectid/:id",
      verifyJWT,
      async (req, res) => {
        const id = req.params.id;
        // const query = { classId: id };
        const filter = { _id: new ObjectId(id) };
        // const result = await cartCollection.deleteOne(query);
        const result = await cartCollection.deleteOne(filter);
        res.send(result);
      }
    );

    // Delete Cart Items By the ClassId
    app.delete("/delete-cart-item-classid/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { classId: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //PAYMENT Routes

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price) * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // Post Payment Info To DB
    app.post("payment-info", verifyJWT, async (req, res) => {
      const paymentInfo = req.body;
      const classesId = paymentInfo.classesId;
      const userEmail = paymentInfo.userEmail;
      const singleClassId = req.query.classId;
      let query;
      if (singleClassId) {
        query = { classId: singleClassId, userMail: userEmail };
      } else {
        query = { classId: { $in: classesId } };
      }
      const classesQuery = {
        _id: { $in: classesId.map((id) => new ObjectId(id)) },
      };
      const classes = await classesCollection.find(classesQuery).toArray();
      const newEnrolledData = {
        userEmail: userEmail,
        classId: singleClassId.map((id) => new ObjectId(id)),
        transactionId: paymentInfo.transactionId,
      };

      const updatedDoc = {
        $set: {
          totalEnrolled:
            classes.reduce(
              (totaL, current) => totaL + current.totalEnrolled,
              0
            ) + 1 || 0,
          availableSeats:
            classes.reduce(
              (totaL, current) => totaL + current.availableSeats,
              0
            ) - 1 || 0,
        },
      };
      const updatedResult = await classesCollection.updateMany(
        classesQuery,
        updatedDoc,
        { upsert: true }
      );
      const enrolledResult = await enrolledCollection.insertOne(
        newEnrolledData
      );
      const deletedResult = await cartCollection.deleteMany(query);
      const paymentResult = await paymentCollection.insertOne(paymentInfo);
      res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
    });

    // Get Payment History
    app.get("/payment-history/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const total = await paymentCollection.countDocuments(query);
      res.send(total);
    });

    // Enrollment Routes
    app.get("popular-classes", async (req, res) => {
      const result = await classesCollection
        .find()
        .sort({ totalEnrolled: -1 })
        .limit(20)
        .toArray();
      res.send(result);
    });

    //Popular Instructors
    app.get("/popular-instructors", async (req, res) => {
      try {
        const pipeline = [
          {
            $group: {
              _id: "$instructoremail", // Changed to match your data structure
              totalEnrolled: { $sum: "$totalenrolled" }, // Changed to match your data structure
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "email",
              as: "instructor",
            },
          },
          {
            $unwind: "$instructor",
          },
          {
            $project: {
              _id: 0,
              instructor: 1,
              totalEnrolled: 1,
            },
          },
          {
            $match: {
              "instructor.role": "instructor",
            },
          },
          {
            $sort: {
              totalEnrolled: -1,
            },
          },
          {
            $limit: 20,
          },
        ];

        const result = await classesCollection.aggregate(pipeline).toArray();

        if (result.length === 0) {
          res.status(404).send({ message: "No popular instructors found." });
        } else {
          res.send(result);
        }
      } catch (error) {
        console.error("Error in /popular-instructors:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Admin Status
    app.get("/admin-status", verifyJWT, verifyAdmin, async (req, res) => {
      const activeClasses = (
        await classesCollection.find({ status: "active" })
      ).toArray().length;
      const inActiveClasses = (
        await classesCollection.find({ status: "insactive" })
      ).toArray().length;
      const instructors = (
        await usersCollections.find({ role: "instructor" })
      ).toArray().length;
      const totalClasses = (await classesCollection.find().toArray()).length;
      const totalEnrolled = (await enrolledCollection.find().toArray()).length;

      const result = {
        activeClasses,
        inActiveClasses,
        instructors,
        totalClasses,
        totalEnrolled,
      };
      res.send(result);
    });

    // Get All Instructor
    app.get("/instructors", async (req, res) => {
      const result = await usersCollections
        .find({ role: "instructor" })
        .toArray();
      res.send(result);
    });

    app.get("/enrolled-classes/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const pipeline = [
        {
          $match: query,
        },
        {
          $lookup: {
            from: "classes",
            localField: "classesId",
            foreignField: "_id",
            as: "classes",
          },
        },
        {
          $unwind: "$classes",
        },
        {
          $lookup: {
            from: "users",
            localField: "classes.instructorEmail",
            foreignField: "email",
            as: "instructor",
          },
        },
        {
          $project: {
            _id: 0,
            instructor: { $arrayElemAt: ["$instructor", 0] },
            classes: 1,
          },
        },
      ];
      const result = await enrolledCollection.aggregate(pipeline).toArray();
      res.send(result);
    });

    // Route For Applied Instructor
    app.post("/as-instructor", async (req, res) => {
      const data = req.body;
      const result = await appliedCollection.insertOne(data);
      res.send(result);
    });

    // Users Can Apply For Instructors

    app.get("/applied-instructor/:email", async (req, res) => {
      const email = req.params.email;
      const result = await appliedCollection.findOne({ email });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error(err);
  }
}

// Run the run function but do not close the client
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Developers!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
