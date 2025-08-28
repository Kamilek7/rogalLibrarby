import requests
from bs4 import BeautifulSoup
import re

def urlFromTitle(bookTitle):
    baseURL= "https://www.goodreads.com/search?utf8=%E2%9C%93"
    # Ta czesc jest okodowana w JS ale dalem na wszelki wypadek
    titleTransformed = bookTitle.replace(" ", "+")
    url = f"{baseURL}&q={titleTransformed}&search_type=books"
    return url

def changeImageSrc(src):
    idx = src.find("/books")
    data = src[idx:]
    idx2 = data.find("._")
    idx3 = data.find("_.")
    data = data[:idx2] + data[idx3+1:]
    source = f"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com{data}"
    return source

def parseURL(url):

    def get_soup(url):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'}
        response = requests.get(f"{url}", headers=headers)
        response = response.text
        soup = BeautifulSoup(response, 'lxml')
        return soup
    page = get_soup(url)
    titles = page.find_all("table", class_="tableList")
    if len(titles)>0:
        list = titles[0].find_all("tr")

        books = []

        for book in list:
            authors =book.find_all("a", class_="authorName")
            authors = [author.find_all("span", itemprop="name")[0].get_text() for author in authors]
            bookName = book.find_all("a", class_="bookTitle")
            bookName = bookName[0].find_all("span", itemprop="name")[0].get_text()
            bookName = bookName.replace("\'", "")
            image = book.find_all("img", class_="bookCover")[0]["src"]
            image = changeImageSrc(image)
            grayText = re.sub(' +', ' ', book.find_all("span", class_="greyText smallText uitext")[0].get_text().replace("\n", " ").replace("really", "").replace(" liked", "").replace(" it ",""))
            books.append({"Title": bookName, "Authors": authors, "Cover" : image, "Info" : grayText, "InDataBase" : False})
        
        return books
    else:
        return 0