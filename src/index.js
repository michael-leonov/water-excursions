import './styles/style.scss';
import { httpRequest } from './js/http-request.js';
import timeClock from '../static/clock-circular-outline.svg';
import checkMarkSvg from '../static/check-mark.svg';

const posts = document.querySelector('.posts');

function postTemplate(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    const postImage = document.createElement('img');
    postImage.src = post.urlImg;

    postElement.appendChild(postImage);

    const postAbout = document.createElement('div');
    postAbout.classList.add('post__about', 'about');

    postElement.appendChild(postAbout);

    const postStatus = document.createElement('p');
    postStatus.textContent = post.statusPost;
    postStatus.classList.add('post__status');

    postElement.appendChild(postStatus);

    const postTimeBlock = document.createElement('div');
    postTimeBlock.classList.add('post__time-block');

    postAbout.appendChild(postTimeBlock);

    const ClockSvg = document.createElement('object');
    ClockSvg.type = 'image/svg+xml';
    ClockSvg.data = timeClock;
    ClockSvg.classList.add('clock-svg');

    postTimeBlock.appendChild(ClockSvg);

    const postTime = document.createElement('p');
    postTime.textContent = post.time;
    postTime.classList.add('post__time');

    postTimeBlock.appendChild(postTime);

    const postTitle = document.createElement('p');
    postTitle.textContent = post.title;
    postTitle.classList.add('post__title');

    postAbout.appendChild(postTitle);

    const postInfo = document.createElement('div');
    postInfo.classList.add('post__info', 'info');

    postAbout.appendChild(postInfo);

    for (let value in post.detail) {
        const postDetail = document.createElement('div');
        postDetail.classList.add('info__detail');

        postInfo.appendChild(postDetail);

        const checkMark = document.createElement('object');
        checkMark.type = 'image/svg+xml';
        checkMark.data = checkMarkSvg;
        checkMark.classList.add('info_check');

        postDetail.appendChild(checkMark);

        const postDetailText = document.createElement('p');
        postDetailText.textContent = post.detail[value];
        postDetailText.classList.add('info__text');

        postDetail.appendChild(postDetailText);
    }

    const postCruiseStartBlock = document.createElement('div');
    postCruiseStartBlock.classList.add('info__time-start');

    postInfo.appendChild(postCruiseStartBlock);

    for (let time in post.cruiseStart) {
        const postCruiseStart = document.createElement('span');
        postCruiseStart.classList.add('time-start');
        postCruiseStart.textContent = post.cruiseStart[time];

        postCruiseStartBlock.appendChild(postCruiseStart);
    }

    const postPriceInfo = document.createElement('div');
    postPriceInfo.classList.add('post__price-block', 'price');

    postAbout.appendChild(postPriceInfo);

    const postPriceBlock = document.createElement('div');
    postPriceBlock.classList.add('post__price');

    postPriceInfo.appendChild(postPriceBlock);

    const postBtnDetail = document.createElement('a');
    postBtnDetail.textContent = 'Подробнее';
    postBtnDetail.classList.add('post__price-btn');

    postPriceInfo.appendChild(postBtnDetail);

    const postPrice = document.createElement('p');
    postPrice.textContent = post.price + ' ₽';
    postPrice.classList.add('post__price-site');

    postPriceBlock.appendChild(postPrice);

    const postPriceOnPier = document.createElement('p');

    if (post.priceOnPier === null) {
        postPriceOnPier.remove();
    } else {
        postPriceOnPier.textContent = post.priceOnPier + ' ₽ на причале';
        postPriceOnPier.classList.add('post__price-pier');

        postPriceBlock.appendChild(postPriceOnPier);
    }

    return postElement;
}

document.addEventListener('DOMContentLoaded', () => {
    httpRequest({
        url: '../static/posts.json',
        onSuccess: (data) => {
            data.forEach((post) => {
                posts.appendChild(postTemplate(post));
            });

            StyledStatus();
            addActiveTimeStartCruise();
            loadMoreTimeCruise();
        },
    });
});

function StyledStatus() {
    const postStatusAll = document.querySelectorAll('.post__status');

    postStatusAll.forEach((status) => {
        if (status.textContent === 'Новинка') {
            status.classList.add('novelty-status');
        } else if (status.textContent === 'Круглый год') {
            status.classList.add('all-time-status');
        } else {
            status.remove();
        }
    });
}

function addActiveTimeStartCruise() {
    const timeStart = document.querySelectorAll('.time-start');

    timeStart.forEach((item) => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

function loadMoreTimeCruise() {
    const timeStartWrapper = document.querySelectorAll('.info__time-start');

    timeStartWrapper.forEach((wrapper) => {
        if (wrapper.children.length > 4) {
            for (let i = 3; i < wrapper.children.length; i++) {
                wrapper.children[i].style.display = 'none';
            }

            const loadMoreBtn = document.createElement('span');
            loadMoreBtn.classList.add('time-start');
            loadMoreBtn.textContent = 'Еще...';
            wrapper.appendChild(loadMoreBtn);

            loadMoreBtn.addEventListener('click', () => {
                loadMoreBtn.remove();
                for (let i = 3; i < wrapper.children.length; i++) {
                    wrapper.children[i].style.display = 'block';
                }
            });
        }
    });
}
