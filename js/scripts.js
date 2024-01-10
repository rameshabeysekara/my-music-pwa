if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => {
      console.log("service-worker registered");
    })
    .catch((error) => {
      console.log(error);
    });
} else {
  console.log("Service workers are not supported");
}
