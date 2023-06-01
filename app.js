let bookList = [],
  basketList = [];

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
const toggleModal = () => {
  /* Sepet açılıp kapnması */
  const basketModelEl = document.querySelector(".basket-modal");
  basketModelEl.classList.toggle("active");
};
const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books));
};
getBooks();
const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i)
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    else starRateHtml += `<i class="bi bi-star-fill "></i>`;
  }
  return starRateHtml;
};
const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book-list");
  let bookListHtml = "";
  bookList.forEach((book, index) => {
    bookListHtml += `<div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
    <div class="row book-card">
      <div class="col-6">
        <img
          class="img-fluid shadow"
          src="${book.imgSource}"
          width="268"
          height="400"
        />
      </div>
      <div class="col-6 d-flex flex-column justify-content-between">
        <div class="book-detail">
          <span class="fos gray fs-5">${book.author}/span><br />
          <span class="fs-4 fw-bold">${book.name}</span><br />
          <span class="book-star-rate">
          ${createBookStars(book.starRate)}
            <span class="gray">${book.reviewCount} reviews</span>
          </span>
          <div>
            <p class="book-description fos gray">
             ${book.description}
            </p>
            <div>
              <span class="balck fw-bold fs-4">${book.price}₺</span>
              ${
                book.oldPrice
                  ? `<span class="fs-4 fw-bold old-price">${book.price}₺</span>`
                  : ""
              }
            </div>
            <button class="btn-purple" onclick ="addBookToBasket(${
              book.id
            })">ADD BASKET</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  });
  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  CHILDREN: "Çocuk",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  SCIENCE: "Bilim",
};

const createBookTypesHtml = () => {
  const filterEl = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1)
      filterTypes.push(book.type);
  });
  filterTypes.forEach((type, index) => {
    filterHtml += `<li class="${
      index == 0 ? "active" : null
    }"onclick ="filterBooks(this)"data-type="${type}">${
      BOOK_TYPES[type] || type
    }</li>`;
  });

  filterEl.innerHTML = filterHtml;
};
const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.type;
  getBooks();
  if (bookType != "ALL")
    bookList = bookList.filter((book) => book.type == bookType);
  createBookItemsHtml();
};

const listBasketItem = () => {
  const basketListEl = document.querySelector(".basket-list");
  const basketCountEl = document.querySelector(".basket-count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  const totalPriceEl = document.querySelector(".total-price");

  let basketListHtml = "";

  let totalPrice = 0;

  basketList.forEach((item) => {
    totalPrice += item.product.price;
    basketListHtml += `<li class="basket-item">
    <img
      src="${item.product.imgSource}"
      width="100"
      height="100"
      alt=""
    /> 
    <div class="basket-item-info">
      <h3 class="book-name">${item.product.name}</h3>
      <span class="book-price">${item.product.price}₺</span><br />
      <span class="book-remove" onclick="removeItemToBasket(${item.product.id})">remove</span>
    </div>
    <div class="book-count">
      <span class="decrease" onclick ="decteaseItemToBasket((${item.product.id})">-</span>
      <span>${item.quantity}</span>
      <span class="increase"  onclick ="incteaseItemToBasket((${item.product.id})>+</span>
    </div>
  </li>`;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket-item">
  No items to Buy again
 </li>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Total :" + totalPrice.toFixed(2) + "₺" : null;
};

const addBookToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);
  if (findedBook) {
    const basketAllreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketAllreadyIndex == -1) {
      let addedItem = { quantity: 1, product: findedBook };
      basketList.push(addedItem);
    } else {
      basketList[basketAllreadyIndex].quantity += 1;
    }
    listBasketItem();
  }
};

const removeItemToBasket = (bookId) => {
  const finedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (finedIndex != -1) {
    basketList.splice(finedIndex, 1);
  }
  listBasketItem();
};
const decteaseItemToBasket = (bookId) => {
  const finedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (finedIndex != -1) {
    if (basketList[finedIndex].quantity != 1)
      basketList[finedIndex].quantity -= 1;
    else removeItemToBasket(bookId);
  }
};
const incteaseItemToBasket = (bookId) => {
  const finedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (finedIndex != -1) {
    if (basketList[finedIndex].quantity != basketList[finedIndex].product.stock)
      basketList[finedIndex].quantity += 1;
    else toastr.error("yeterince stogumyok");;
  }
};

setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);
