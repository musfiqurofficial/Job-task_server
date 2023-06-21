const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://musfiq_test:UpvI02h2jfq1afET@cluster0.nj6duvr.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("db is connected!");
  })
  .catch((error) => {
    console.log(error, "db is not connected!");
  });

const dataSchema = new mongoose.Schema({
  name: String,
  selectedOptions: [
    {
      value: String,
      label: String,
    },
  ],
  agreeTerms: Boolean,
});

const Data = mongoose.model("Data", dataSchema);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/api/data", async (req, res) => {
  const { name, optionsData, agreeTerms } = req.body;

  const newData = new Data({
    name,
    selectedOptions: optionsData,
    agreeTerms: agreeTerms,
  });

  try {
    await newData.save();
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/data/:selectedOptions", async (req, res) => {
  try {
    const selectedOptionsValue = req.params.selectedOptions;
    const data = await Data.find({
      "selectedOptions.value": selectedOptionsValue,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.put("/api/data/:id", async (req, res) => {
  try {
    const dataId = req.params.id;
    const updatedData = req.body;

    await Data.findByIdAndUpdate(dataId, updatedData);

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update data" });
  }
});

app.delete("/api/data/:id", async (req, res) => {
  try {
    const dataId = req.params.id;

    await Data.findByIdAndDelete(dataId);

    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete data" });
  }
});


app.get("/", (req, res) => {
  res.send("<h1 style='color: green'> Server Home Page </h1>");
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`server is running: http://localhost:${port}`);
});
