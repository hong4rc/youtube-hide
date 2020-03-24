((document, MutationObserver, console) => {
  let titlePage;
  const replaceTitle = '.';

  const getTitle = () => {
    if (!titlePage) {
      titlePage = document.querySelector('.title yt-formatted-string.ytd-video-primary-info-renderer');
    }
    return titlePage;
  };

  const i = () => {};
  let showDocTitle = i;

  let isHide = false;

  const titleElem = document.querySelector('title');
  let dataTitle = titleElem.innerText;

  const setTitle = (str = replaceTitle) => {
    titleElem.innerText = str;
  };

  // hiding => hide title again
  const observer = new MutationObserver(() => {
    if (!isHide || titleElem.innerText === replaceTitle) {
      console.log('Wrong event', 'not hide');
      return;
    }
    dataTitle = titleElem.innerText;
    setTitle();
  });

  const showTitle = () => {
    console.log('showTitle');
    if (!isHide) {
      return;
    }
    isHide = !isHide;

    observer.disconnect();

    showDocTitle();
    const title = getTitle();
    title.style.visibility = '';
  };

  const hideTitle = () => {
    console.log('hideTitle');
    if (isHide) {
      return;
    }
    isHide = !isHide;

    const title = getTitle();
    title.style.visibility = 'hidden';
    dataTitle = titleElem.innerText;
    setTitle();
    showDocTitle = () => {
      setTitle(dataTitle);
      showDocTitle = i;
    };

    observer.observe(titleElem, {
      childList: true,
    });
  };

  // eslint-disable-next-line no-param-reassign
  document.onkeyup = (e) => {
    if (e.key.toLowerCase() === 'q' && e.ctrlKey) {
      if (isHide) {
        showTitle();
      } else {
        hideTitle();
      }
    }
  };

// eslint-disable-next-line no-undef
})(document, MutationObserver, console);
