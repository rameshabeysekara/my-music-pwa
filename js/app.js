import appDB from "./database/app-db.js";

appDB
  .open()
  .then(() => {
    console.log("success");
    appDB
      .getAll()
      .then(displaySongs)
      .catch((error) => {
        console.log("Failed to get: ", error);
      });
  })
  .catch((e) => {
    console.log("Failed to open: ", e);
  });

const songForm = document.getElementById("songForm");
const songList = document.getElementById("songList");

document.addEventListener("DOMContentLoaded", () => {
  songForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("errSongArtist").innerHTML = "";
    document.getElementById("errSongTitle").innerHTML = "";

    const songTitle = document.getElementById("songTitle").value;
    const songArtist = document.getElementById("songArtist").value;

    if (songTitle < 1 || songArtist < 1) {
      if (songArtist < 1) {
        document.getElementById("errSongArtist").innerHTML =
          "Please enter Song Artist";
      }
      if (songTitle < 1) {
        document.getElementById("errSongTitle").innerHTML =
          "Please enter Song Title";
      }
      return;
    } else {
      if (!songTitle || !songArtist) {
        alert("Please enter both the song title and artist name.");
        return;
      }
      appDB
        .add(songTitle, songArtist, 0)
        .then(() => {
          songList.replaceChildren();
          displaySongs();
        })
        .catch((error) => {
          console.log("Failed to add song: ", error);
        });
      songForm.reset();
    }
  });
});

function displaySongs() {
  appDB
    .getAll()
    .then((songs) => {
      songs.forEach((song) => {
        let currentLikes = song.likes;
        const songItem = document.createElement("div");
        songItem.classList.add("song-item");
        songItem.innerHTML = `
              <div class="details-container">
                <div class="details">
                  <h3>${song.title}</h3>
                  <p>${song.artist}</p>
                </div>
                <div class="likes">
                  <p id=${song.id + "likesCount"}>Likes: ${currentLikes}</p>
                </div>
              </div>
              <div class="clearfix">
                <button type="button" id=${
                  song.id + "delete"
                } class="removebtn">Remove</button>
                <button type="button" id=${
                  song.id + "like"
                } class="likebtn">+1 Like</button>
              </div>
        `;
        songList.appendChild(songItem);
        const likeCount = document.getElementById(song.id + "likesCount");
        const likeButton = document.getElementById(song.id + "like");
        const deleteButton = document.getElementById(song.id + "delete");
        likeButton.addEventListener("click", () => {
          currentLikes++;
          appDB
            .addALike(song, currentLikes)
            .then(() => {
              likeCount.innerHTML = "Likes: " + currentLikes;
            })
            .catch((error) => {
              console.log("Failed to like: ", error);
            });
        });
        deleteButton.addEventListener("click", () => {
          appDB
            .delete(song.id)
            .then(() => {
              songItem.remove();
            })
            .catch((error) => {
              console.log("Failed to delete: ", error);
            });
        });
      });
    })
    .catch((error) => {
      console.log("Failed to get songs: ", error);
    });
}
