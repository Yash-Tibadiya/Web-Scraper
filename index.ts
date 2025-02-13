import puppeteer, { Browser } from "puppeteer";
const url: string = "https://books.toscrape.com/";
import * as fs from "fs";
import { parse } from "json2csv";

// Defining the structure of the data that will be scraped
type bookDataType = {
  title: string | null;
  price: string;
  imageSrc?: string;
  inStock: string;
  rating?: number | string;
}[];

// Function to fetch book data
const fetchData = async () => {
  // Launching Puppeteer browser instance with non-headless mode (browser window visible)
  const browser: Browser = await puppeteer.launch({ headless: false });
  const Page = await browser.newPage(); // Opening a new page/tab
  await Page.goto(url); // Navigating to the target URL

  // Scraping book data from the page
  const bookData: bookDataType = await Page.evaluate((url) => {
    // Selecting all books on the page
    const books = Array.from(document.querySelectorAll(".product_pod"));

    // Mapping over each book element to extract relevant data
    const info = books.map((book: Element) => ({
      title: book.querySelector("h3 a")?.getAttribute("title") || null, // Title of the book
      price: (book.querySelector(".price_color") as HTMLElement)?.innerText, // Price of the book
      imageSrc: url + book.querySelector("img")?.getAttribute("src"), // Image source URL (concatenating base URL)
      inStock:
        (book.querySelector(".instock") as HTMLElement)?.innerText.trim() || "", // Stock status
      rating: book.querySelector(".star-rating")?.classList[1], // Rating of the book (class-based)
    }));
    return info; // Returning the scraped data
  }, url);

  // Cleaning the price data (removing the currency symbol)
  bookData.forEach((book) => {
    book.price = book.price.replace("£", ""); // Removing the "£" sign
  });

  // Writing the scraped data to a JSON file (pretty-printed)
  fs.writeFileSync("bookdata.json", JSON.stringify(bookData, null, 2));

  // Converting the data to CSV format
  try {
    // Specifying the fields to be included in the CSV
    const csv = parse(bookData, {
      fields: ["title", "price", "imageSrc", "inStock", "rating"],
    });
    // Writing the CSV data to a file
    fs.writeFileSync("bookdata.csv", csv);
    console.log("CSV file created successfully!"); // Log success message
  } catch (err) {
    console.error("Error converting to CSV:", err); // Log error if CSV conversion fails
  }

  // Closing the browser after data collection
  await browser.close();
};

fetchData();