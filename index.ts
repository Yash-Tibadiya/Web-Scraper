import * as fs from "fs";
import { parse } from "json2csv";
import puppeteer, { Browser } from "puppeteer";

const baseUrl: string = "https://books.toscrape.com/catalogue/page-";
const totalPages: number = 50; // Total number of pages

// Defining the structure of the data that will be scraped
type bookDataType = {
  title: string | null;
  price: string;
  imageSrc?: string;
  inStock: string;
  rating?: number | string;
}[];

const fetchAllPages = async () => {
  // Launching Puppeteer browser instance with non-headless mode (browser window visible)
  const browser: Browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage(); // Opening a new page/tab
  let allBooks: bookDataType = []; // Array to store all books

  // Loop through all pages
  for (let i = 1; i <= totalPages; i++) {
    const pageUrl = `${baseUrl}${i}.html`;
    console.log(`Scraping page: ${pageUrl}`);

    // Navigating to the target URL
    await page.goto(pageUrl, { waitUntil: "load", timeout: 0 });

    // Extract book data from the current page
    const bookData: bookDataType = await page.evaluate(() => {
      // Selecting all books on the page
      const books = Array.from(document.querySelectorAll(".product_pod"));

      // Mapping over each book element to extract relevant data
      return books.map((book: Element) => ({
        // Title of the book
        title: book.querySelector("h3 a")?.getAttribute("title") || null,
        // Price of the book
        price: (
          book.querySelector(".price_color") as HTMLElement
        )?.innerText.replace("£", ""), // Remove £ sign
        // Image source URL (concatenating base URL)
        imageSrc: new URL(
          book.querySelector("img")?.getAttribute("src") || "",
          document.location.origin
        ).href,
        // Stock status
        inStock:
          (book.querySelector(".instock") as HTMLElement)?.innerText.trim() ||
          "",
        // Rating of the book (class-based)
        rating: book.querySelector(".star-rating")?.classList[1] || "No rating",
      }));
    });

    allBooks = allBooks.concat(bookData); // Append data from current page
  }

  console.log(`Scraped ${allBooks.length} books from ${totalPages} pages.`);

  // Save to JSON file
  fs.writeFileSync("bookdata.json", JSON.stringify(allBooks, null, 2));
  //? Formatting options: [ null: No specific key transformations ] | [ 2: Indentation level (pretty-printing for readability) ]

  // Convert and save to CSV
  try {
    // Specifying the fields to be included in the CSV
    const csv = parse(allBooks, {
      fields: ["title", "price", "imageSrc", "inStock", "rating"],
    });
    // Writing the CSV data to a file
    fs.writeFileSync("bookdata.csv", csv);
    console.log("CSV file created successfully!");
  } catch (err) {
    console.error("Error converting to CSV:", err);
  }

  // Closing the browser after data collection
  await browser.close();
};

fetchAllPages();

//? Page.evaluate - It is a method that allows you to execute JavaScript code inside the context of a webpage and retrieve the result back to your Node.js environment.
//? puppeteer.launch - This function launches a new instance of Google Chrome (or Chromium).
//? headless: false - the browser opens a visible window.
