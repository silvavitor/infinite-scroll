// The API is free to use, no problem to show my key
const apiKey = "ZY9wkeF3GZ9wiz7xC8k_MF7LCe9E2CNcP07b9fxQGpg";

const searchButton = document.querySelector("#search");
const imageContainer = document.querySelector("#image-container");
const scrollToTopContainer = document.querySelector("#scroll-to-top-container");
const scrollToTopButton = document.querySelector("#scroll-to-top");
const closeErrorButton = document.querySelector("#close-error");
const loading = document.querySelector("#loading");
const error = document.querySelector("#error-container");

const firstTimeDownloadLimit = 5;
const standardDownloadLimit = 30;

let isFirstTimeLoading = true;
let readyToLoadMorePhotos = false;
let downloadLimit = firstTimeDownloadLimit;
let photosLoaded = totalPhotos = 0;
let filter = "";
let photos = [];

function showLoading() {
    loading.hidden = false;
}

function hideLoading() {
    loading.hidden = true;
}

function showError() {
    error.hidden = false;
    hideLoading();
}

function hideError() {
    error.hidden = true;
}

function cleanImageContainer() {
    imageContainer.innerHTML = "";
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function imageLoaded() {
    photosLoaded++;
    if(photosLoaded === totalPhotos){
        photosLoaded = 0;
        totalPhotos = 0;
        readyToLoadMorePhotos = true;
        hideLoading();
    }
}

function appendPhotoToContainer(photo) {
    const linkContainer = document.createElement("a");
    setAttributes(linkContainer, {
        href: photo.links.html,
        target: "_blank",
    });

    const image = document.createElement("img");
    setAttributes(image, {
        src: photo.urls.regular,
        alt: photo.alt_description,
        title: photo.alt_description,
    });
    image.addEventListener("load", imageLoaded);
    linkContainer.appendChild(image);
    imageContainer.appendChild(linkContainer);
}

function displayPhotos() {
    totalPhotos = photos.length;
    for (const photo of photos) {
        appendPhotoToContainer(photo);
    }
}

async function getPhotos() {
    
    const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${downloadLimit}&query=${filter}`;
    try {
        const response = await fetch(apiUrl);
        if(response.ok){
            photos = await response.json();
            if(isFirstTimeLoading){
                downloadLimit = standardDownloadLimit;
                isFirstTimeLoading = false;
            }
            displayPhotos();
        } else {
            showError();
        }
    } catch (error) {
        showError();
    }
}

function filterPhotos() {
    const input = document.querySelector("#search-text");
    filter = input.value;

    downloadLimit = firstTimeDownloadLimit;
    isFirstTimeLoading = true;

    cleanImageContainer();
    showLoading()
    getPhotos();
}

function userArrivedLoadingPoint(){
    return window.scrollY + window.innerHeight >= document.body.offsetHeight * 0.7;
}

function handleScrollToTopButton() {
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        scrollToTopContainer.classList.remove("hide");
    } else {
        scrollToTopContainer.classList.add("hide");
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener("scroll", () => {
    handleScrollToTopButton();

    if(userArrivedLoadingPoint() && readyToLoadMorePhotos) {
        readyToLoadMorePhotos = false;
        getPhotos();
    }

});
searchButton.addEventListener("click", filterPhotos);
scrollToTopButton.addEventListener("click", scrollToTop);
closeErrorButton.addEventListener("click", hideError);
getPhotos();