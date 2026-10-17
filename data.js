/* ==========================================================
   SHEHRYAR PRINTS & GIFTS — EDIT THIS FILE TO UPDATE THE SHOP
   (This is the only file you need for prices and products.)

   HOW TO SET A PRICE:  change  price: null  to  price: 600
   While price is null the site shows "Price pending" and the
   WhatsApp message says the price will be confirmed.
   Save only after you have calculated your real cost.
   ========================================================== */
const SITE = {
  name: "Shehryar Stationery",
  collection: "Shehryar Prints & Gifts",
  whatsapp: "923204505505",        // international format, digits only (0320 4505505 -> 92 320 4505505)
  announcement: "Karachi delivery only for now. Orders are confirmed on WhatsApp.",
  phoneDisplay: "0320 4505505",    // shown in the footer
  area: "North Nazimabad, Karachi",
  instagram: "shehryarstationery", // leave "" to hide
  facebook: "",                    // full link, or "" to hide
  reviews: []                      // add real ones only: { name: "Ali", text: "..." }
};
const COLLECTIONS = [
  { id: "custom-prints", name: "Custom Prints", blurb: "Your photos and your words, printed on A4." },
  { id: "original-posters", name: "Original Posters", blurb: "Quote posters designed by us, printed on A4." }
];
const PRODUCTS = [
  { id: "collage-4", name: "4-Photo A4 Collage", collection: "custom-prints", featured: true,
    art: { type: "collage", n: 4 }, price: null, size: "A4",
    desc: "Four of your photos arranged in one clean A4 layout. Send your photos on WhatsApp after we discuss your order.",
    availability: "Made to order", productionTime: "To be confirmed on WhatsApp",
    fields: [{ key: "Style notes", label: "Occasion or style notes (optional)", type: "text" }] },
  { id: "collage-6", name: "6-Photo A4 Collage", collection: "custom-prints", featured: true,
    art: { type: "collage", n: 6 }, price: null, size: "A4",
    desc: "Six photos in one A4 layout, good for birthdays, family and trips.",
    availability: "Made to order", productionTime: "To be confirmed on WhatsApp",
    fields: [{ key: "Style notes", label: "Occasion or style notes (optional)", type: "text" }] },
  { id: "collage-9", name: "9-Photo A4 Collage", collection: "custom-prints", featured: false,
    art: { type: "collage", n: 9 }, price: null, size: "A4",
    desc: "A nine-photo grid on A4 for a bigger set of memories.",
    availability: "Made to order", productionTime: "To be confirmed on WhatsApp",
    fields: [{ key: "Style notes", label: "Occasion or style notes (optional)", type: "text" }] },
  { id: "name-date-poster", name: "Personalized Name & Date Poster", collection: "custom-prints", featured: true,
    art: { type: "poster", lines: ["Your Name Here", "Your Date Here"] }, price: null, size: "A4",
    desc: "A text poster with your name and a date or short line, designed by us.",
    availability: "Made to order", productionTime: "To be confirmed on WhatsApp",
    fields: [{ key: "Name", label: "Name on poster", type: "text", required: true },
             { key: "Date or line", label: "Date or short line (optional)", type: "text" }] },
  { id: "study-poster", name: "Study Motivation Poster", collection: "original-posters", featured: true,
    art: { type: "poster", lines: ["Study a little today.", "Thank yourself later."] }, price: null, size: "A4",
    desc: "An original study motivation design for a desk or study wall.",
    availability: "Made to order", productionTime: "To be confirmed on WhatsApp", fields: [] },
  { id: "quote-set-3", name: "Set of 3 Original Quote Posters", collection: "original-posters", featured: false, bundle: true,
    art: { type: "set", lines: ["Start small.", "Keep going.", "Finish proud."] }, price: null, size: "A4 x 3",
    desc: "Three matching A4 quote posters, sold together as one set.",
    availability: "Made to order", productionTime: "To be confirmed on WhatsApp",
    fields: [{ key: "Preferred themes", label: "Preferred themes (optional)", type: "text" }] }
];
const SHIPPING_INFO = "Karachi only for now. The delivery charge is told after we confirm your order and location. Prints go flat in a protective pack.";
window.__DATA__ = { SITE: SITE, COLLECTIONS: COLLECTIONS, PRODUCTS: PRODUCTS, SHIPPING_INFO: SHIPPING_INFO }; /* do not edit this line */
