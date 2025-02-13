import puppeteer, { Browser } from "puppeteer";
const url: string = "https://books.toscrape.com/";
import * as fs from "fs";
import { parse } from "json2csv";

type bookDataType = {
  title: string | null;
  price: string;
  imageSrc?: string;
  inStock: string;
  rating?: number | string;
}[];

const fetchData = async () => {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const Page = await browser.newPage();
  await Page.goto(url);

  const bookData: bookDataType = await Page.evaluate((url) => {
    const books = Array.from(document.querySelectorAll(".product_pod"));
    const info = books.map((book: Element) => ({
      title: book.querySelector("h3 a")?.getAttribute("title") || null,
      price: (book.querySelector(".price_color") as HTMLElement)?.innerText,
      imageSrc: url + book.querySelector("img")?.getAttribute("src"),
      inStock:
        (book.querySelector(".instock") as HTMLElement)?.innerText.trim() || "",
      rating: book.querySelector(".star-rating")?.classList[1],
    }));
    return info;
  }, url);

  bookData.forEach((book) => {
    book.price = book.price.replace("£", "");
  });

  // Convert to JSON
  fs.writeFileSync("bookdata.json", JSON.stringify(bookData, null, 2)); // Added pretty printing

  // Convert to CSV
  try {
    const csv = parse(bookData, {
      fields: ["title", "price", "imageSrc", "inStock", "rating"],
    }); // Specify fields for CSV
    fs.writeFileSync("bookdata.csv", csv);
    console.log("CSV file created successfully!");
  } catch (err) {
    console.error("Error converting to CSV:", err);
  }

  await browser.close();
};

fetchData();
