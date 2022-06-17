new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      myMsg: 'this is just message',
      url: '',
      baseUrl: baseUrl,
      shortUrl: null,
      toCopyUrl: '',
      isValid: false,
      urlRule: [
        (v) => !!v || 'URL is required',
        (v) => {
          let res = v.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
          );
          this.isValid = res !== null;
          return (this.isValid && this.url !== '') || 'Invalid URL';
        },
      ],
      dialog: false,
    };
  },
  methods: {
    generateUrl: async function () {
      const res = await axios.post(`/shorturl`, {
        url: this.url,
      });
      if (res.data.status) {
        this.shortUrl = res.data.link;
        this.toCopyUrl = this.baseUrl + '/' + this.shortUrl.slug;
      }
    },
    clear: async function () {
      this.url = '';
    },
    copy: function () {
      navigator.clipboard.writeText(this.toCopyUrl).then(
        function () {},
        function (err) {
          console.error(err);
        },
      );
    },
    openAccessLogDialog: function () {
      this.dialog = true;
    },
  },
});
