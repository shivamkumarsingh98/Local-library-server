const { uploadOnCloudinary } = require("../Utils/Cloudinary");
const LibrariesModel = require("../models/LibrariesModel"); // make sure this path is correct

const createLibraries = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const {
      librariename,
      city,
      location,
      services,
      time,
      totalseats,
      availableseats,
      trial,
      price,
      shifts,
      description,
      ownerId,
    } = req.body;

    // ✅ Handle multiple images (if you use upload.array)
    const files = req.files || (req.file ? [req.file] : []);
    const imageUrls = [];

    for (const file of files) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded?.url) imageUrls.push(uploaded.url);
    }

    // ✅ Validate required fields
    if (
      !librariename ||
      !city ||
      !location ||
      !services ||
      !totalseats ||
      !availableseats ||
      !trial ||
      !price ||
      !description ||
      !ownerId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Convert data types properly
    const parsedServices =
      typeof services === "string" ? services.split(",") : services;

    const parsedPrice = typeof price === "string" ? JSON.parse(price) : price; // expect array of { type, oneMonth... }

    const parsedShifts =
      typeof shifts === "string" ? JSON.parse(shifts) : shifts; // expect array of { name, start, end }

    const newLibrary = {
      librariename,
      city,
      location,
      images: imageUrls,
      services: parsedServices,
      time,
      totalseats: Number(totalseats),
      availableseats: Number(availableseats),
      trial,
      price: parsedPrice,
      description,
      shifts: parsedShifts,
      ownerId,
    };

    const savedLibrary = await LibrariesModel.create(newLibrary);

    return res.status(201).json({
      message: "Library created successfully ✅",
      library: savedLibrary,
    });
  } catch (error) {
    console.error("Error creating library:", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateLibraries = async (req, res) => {
  // Implementation for updating libraries

  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedLibrary = await LibrariesModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedLibrary) {
      return res.status(404).json({ message: "Library not found" });
    }
    return res.status(200).json({
      message: "Library updated successfully",
      library: updatedLibrary,
    });
  } catch (error) {
    console.error("Error updating library:", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateLibraryImage = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  try {
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const cloudinaryResponse = await uploadOnCloudinary(file.path);
    if (!cloudinaryResponse || !cloudinaryResponse.url) {
      return res.status(500).json({ message: "Image upload failed" });
    }
    const updatedLibrary = await LibrariesModel.findByIdAndUpdate(
      id,
      { images: cloudinaryResponse.url },
      { new: true }
    );
    if (!updatedLibrary) {
      return res.status(404).json({ message: "Library not found" });
    }
    return res.status(200).json({
      message: "Library image updated successfully",
      library: updatedLibrary,
    });
  } catch (error) {
    console.error("Error updating library image:", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateAvailableSets = async (req, res) => {
  const { id } = req.params;
  const { avbilalsets } = req.body;
  try {
    const updatedLibrary = await LibrariesModel.findByIdAndUpdate(
      id,
      { avbilalsets },
      { new: true }
    );
    if (!updatedLibrary) {
      return res.status(404).json({ message: "Library not found" });
    }
    return res.status(200).json({
      message: "Available sets updated successfully",
      library: updatedLibrary,
    });
  } catch (error) {
    console.error("Error updating available sets:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllLibraries = async (req, res) => {
  try {
    const libraries = await LibrariesModel.find();
    return res.status(200).json({ libraries });
  } catch (error) {
    console.error("Error fetching libraries:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getLibraryById = async (req, res) => {
  const { id } = req.params;
  try {
    const library = await LibrariesModel.findById(id);
    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }
    return res.status(200).json({ library });
  } catch (error) {
    console.error("Error fetching library:", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteLibrary = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLibrary = await LibrariesModel.findByIdAndDelete(id);
    if (!deletedLibrary) {
      return res.status(404).json({ message: "Library not found" });
    }
    return res.status(200).json({ message: "Library deleted successfully" });
  } catch (error) {
    console.error("Error deleting library:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLibraries,
  updateLibraries,
  updateLibraryImage,
  updateAvailableSets,
};
