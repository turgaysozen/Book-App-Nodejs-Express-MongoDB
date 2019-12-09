const rootStyle = window.getComputedStyle(document.documentElement);

if (rootStyle.getPropertyValue('--book-cover-width-large') != null && rootStyle.getPropertyValue('--book-cover-width-large') !== '') {
  ready();
} else {
  document.getElementById('main-css').addEventListener('load', ready);
}

function ready() {
  const coverWdith = parseFloat(rootStyle.getPropertyValue('--book-cover-width-large'));
  const coverAspectRatio = parseFloat(rootStyle.getPropertyValue('--book-cover-aspec-ratio'));
  const coverHeight = coverWdith / coverAspectRatio;

  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWdith,
    imageResizeTargetHeight: coverHeight
  })

  FilePond.parse(document.body);
}
