import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function (e) {
   if (e.target.dataset.like) {
      handleLikeClick(e.target.dataset.like);
   } else if (e.target.dataset.retweet) {
      handleRetweetClick(e.target.dataset.retweet);
   } else if (e.target.dataset.reply) {
      handleReplyClick(e.target.dataset.reply);
   } else if (e.target.id === 'tweet-btn') {
      handleTweetBtnClick();
   } else if (e.target.dataset.replyTweet) {
      handleTweetReplyClick(e.target.dataset.replyTweet);
   } else if (e.target.dataset.delete) {
      deleteBtn(e.target.dataset.delete);
   } else if ((e.target.dataset.deleteReply, e.target.dataset.replyUuid)) {
      deleteReply(e.target.dataset.deleteReply, e.target.dataset.replyUuid);
   }
});

function handleLikeClick(tweetId) {
   const targetTweetObj = tweetsData.filter(function (tweet) {
      return tweet.uuid === tweetId;
   })[0];

   if (targetTweetObj.isLiked) {
      targetTweetObj.likes--;
   } else {
      targetTweetObj.likes++;
   }
   targetTweetObj.isLiked = !targetTweetObj.isLiked;
   render();
}

function handleRetweetClick(tweetId) {
   const targetTweetObj = tweetsData.filter(function (tweet) {
      return tweet.uuid === tweetId;
   })[0];

   if (targetTweetObj.isRetweeted) {
      targetTweetObj.retweets--;
   } else {
      targetTweetObj.retweets++;
   }
   targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
   render();
}

function handleReplyClick(replyId) {
   document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtnClick() {
   const tweetInput = document.getElementById('tweet-input');

   if (tweetInput.value) {
      tweetsData.unshift({
         handle: `@Jay`,
         profilePic: `images/jay.webp`,
         likes: 0,
         retweets: 0,
         tweetText: tweetInput.value,
         replies: [],
         isLiked: false,
         isRetweeted: false,
         uuid: uuidv4(),
      });
      render();
      tweetInput.value = '';
   }
}

localStorage.setItem('tweetsData', JSON.stringify(tweetsData));

function handleTweetReplyClick(replyTweetId) {
   const replyInput = document.getElementById(`reply-input-${replyTweetId}`);

   const replyTweetObj = tweetsData.filter(function (tweet) {
      return tweet.uuid === replyTweetId;
   })[0];

   if (replyInput.value) {
      replyTweetObj.replies.unshift({
         handle: `@Jay`,
         profilePic: `images/jay.webp`,
         tweetText: replyInput.value,
         uuid: uuidv4(),
      });
      replyInput.value = '';
      render();
      handleReplyClick(replyTweetId);
   }
}

function deleteBtn(deleteTweetId) {
   const deleteTweetObj = tweetsData
      .map(function (tweet) {
         return tweet.uuid;
      })
      .indexOf(deleteTweetId);
   tweetsData.splice(deleteTweetObj, 1);
   render();
}

function deleteReply(deleteTweetId, replyUuid) {
   const deleteTweet = tweetsData.find((tweet) => tweet.uuid === deleteTweetId);
   if (!deleteTweet) return;

   const replyIndex = deleteTweet.replies.findIndex(
      (reply) => reply.uuid === replyUuid
   );
   if (replyIndex === -1) return;

   deleteTweet.replies.splice(replyIndex, 1);
   render();
}

function getFeedHtml() {
   let feedHtml = ``;

   tweetsData.forEach(function (tweet) {
      let likeIconClass = '';
      tweet.isLiked ? (likeIconClass = 'liked') : '';

      let retweetIconClass = '';
      tweet.isRetweeted ? (retweetIconClass = 'retweeted') : '';

      let deleteDiv = '';
      if (tweet.handle === '@Jay') {
         deleteDiv = /* HTML */ `
            <span>
               <i
                  class="fa-solid fa-trash"
                  data-delete="${tweet.uuid}"
                  id="delete-btn"
               ></i>
            </span>
         `;
      }

      let repliesHtml = '';
      if (tweet.replies.length > 0) {
         tweet.replies.forEach(function (reply) {
            let deleteReplyDiv = '';
            if (reply.handle === '@Jay') {
               deleteReplyDiv = /* HTML */ `
                  <span>
                     <i
                        class="fa-solid fa-trash"
                        data-delete-reply="${tweet.uuid}"
                        data-reply-uuid="${reply.uuid}"
                        id="delete-reply-btn"
                     ></i>
                  </span>
               `;
            }
            repliesHtml += /* HTML */ `
               <div class="tweet-reply">
                  <div class="tweet-inner">
                     <img src="${reply.profilePic}" class="reply-profile-pic" />
                     <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                        ${deleteReplyDiv}
                     </div>
                  </div>
               </div>
            `;
         });
      }

      feedHtml += /* HTML */ `
         <div class="tweet">
            <div class="tweet-inner">
               <img src="${tweet.profilePic}" class="profile-pic" />
               <div>
                  <p class="handle">${tweet.handle}</p>
                  <p class="tweet-text">${tweet.tweetText}</p>
                  <div class="tweet-details">
                     <span class="tweet-detail">
                        <i
                           id="reply"
                           class="fa-regular fa-comment-dots"
                           data-reply="${tweet.uuid}"
                        ></i>
                        ${tweet.replies.length}
                     </span>
                     <span class="tweet-detail">
                        <i
                           class="fa-solid fa-heart ${likeIconClass}"
                           data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                     </span>
                     <span class="tweet-detail">
                        <i
                           class="fa-solid fa-retweet ${retweetIconClass}"
                           data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                     </span>
                     ${deleteDiv}
                  </div>
               </div>
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
               <div class="reply-input-area">
                  <img
                     src="images/jay.webp"
                     class="profile-pic reply-profile-pic"
                  />
                  <textarea
                     placeholder="Reply Tweet"
                     id="reply-input-${tweet.uuid}"
                     class="reply-input"
                  ></textarea>
               </div>
               <button
                  id="reply-btn"
                  class="reply-btn"
                  data-reply-tweet="${tweet.uuid}"
               >
                  Reply
               </button>
               ${repliesHtml}
            </div>
         </div>
      `;
   });
   return feedHtml;
}

function render() {
   document.getElementById('feed').innerHTML = getFeedHtml();
}

render();
