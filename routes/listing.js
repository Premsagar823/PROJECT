const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

//validate error
const validateListing = (req,res, next) =>{
  let {error} = listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(404, errMsg);
   }else{
    next();
   }
};

// Index Route - All listings
router.get("/", wrapAsync(async(req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New Route - Show form to create a listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route - Single listing
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

//Create Route - Handle new listing form submission
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
  })
);

// Edit Route - Show edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update Route - Handle edit form submission
router.put(
  "/:id",
   validateListing,
   wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

// Delete Route - Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log( deletedListing);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;
