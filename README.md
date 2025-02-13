# Web Scraper for Books

This project uses Puppeteer, a Node library which provides a high-level API to control headless Chrome or Chromium, to scrape book data from [books.toscrape.com](https://books.toscrape.com/). It extracts book titles, prices, image URLs, stock availability, and ratings, then saves the data in both JSON and CSV formats.

## Prerequisites

Before running the scraper, ensure you have the following installed:

* **Node.js:** Make sure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Yash-Tibadiya/Web-Scraper
   cd Web-Scraper
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```
   This command will install Puppeteer, json2csv, and any other required packages.

## Usage

To run the scraper:

```bash
npm run dev
```

This will:
1. Launch a headless Chrome browser (you can change `headless: false` to `true` in the code to see the browser in action).
2. Navigate to the target website.
3. Extract the book data.
4. Clean the price data (removes the "£" symbol).
5. Save the data to `bookdata.json` and `bookdata.csv` files in the project directory.
6. Close the browser.

## Output

The script generates two output files:

- `bookdata.json`: Contains the scraped data in JSON format. The JSON is pretty-printed for readability.
- `bookdata.csv`: Contains the scraped data in CSV format, making it easy to import into spreadsheets or other data analysis tools.

## Project Structure

```
YOUR_REPO_NAME/
├── index.js            # The main scraper script
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Records the exact versions of dependencies
├── tsconfig.json       # Configuration for TypeScript
└── README.md           # This file
```

## Customization

- **headless option:** You can modify the `headless` option in the `puppeteer.launch()` function to control whether the browser runs in headless mode (invisible) or not. Set it to `false` to see the browser in action for debugging or visualization.
  
- **Target URL:** Change the `url` variable at the beginning of the script to scrape data from a different website. You'll likely need to adjust the selectors within the `Page.evaluate()` function to match the structure of the new website.
  
- **Data extraction:** The script currently extracts title, price, image source, stock availability, and rating. You can modify the `Page.evaluate()` function to extract other data points as needed.
  
- **Output files:** The script saves the data to `bookdata.json` and `bookdata.csv`. You can change the filenames or the output format (e.g., to a database) by modifying the code.

## Disclaimer

- **Website terms of service:** Always respect the target website's terms of service and `robots.txt` before scraping. Avoid scraping excessively or in a way that could harm the website.
  
- **Website structure changes:** Websites can change their structure, which might break the scraper. You may need to update the selectors in the code if this happens.

## License

[MIT License]

Feel free to contribute to this project!
