

<template>
  <v-main>
    <v-container style="margin-top: 200px">
      <v-row justify="center">
        <v-col cols="8">
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="url"
              label="URL"
              required
              :rules="urlRule"
            ></v-text-field>

            <v-row>
              <v-col cols="6">
                <v-btn
                  color="primary"
                  x-large
                  @click="generateUrl"
                  :disabled="!isValid"
                >
                  SHORT URL
                </v-btn>

                <v-btn
                  color="error"
                  class="mr-4"
                  x-large
                  @click="clear"
                  :disabled="url === ''"
                  style="margin-left: 10px;"
                >
                  Clear
                </v-btn>
              </v-col>
              <v-col cols="6" style="text-align: right">
                <a href="#" @click.prevent="openAccessLogDialog">Access Log</a>
              </v-col>
            </v-row>
          </v-form>

          <div style="margin-top: 30px" v-if="shortUrl !== null">
            <v-card class="mx-auto" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="text-h5 mb-1">
                    <a :href="toCopyUrl">{{ this.toCopyUrl }}</a>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ this.shortUrl.url }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-card-actions>
                <v-btn color="primary" x-large @click="copy"> COPY LINK </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Access Log</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="dialog = false"> Close </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <div>
              <v-simple-table fixed-header height="800px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">ID</th>
                      <th class="text-left">Short URL</th>
                      <th class="text-left">Destination URL</th>
                      <th class="text-left">User Agent</th>
                      <th class="text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in accessLogList" :key="row.id">
                      <td>{{ row.id }}</td>
                      <td>{{ baseUrl + '/' + row.tb_link.slug }}</td>
                      <td>{{ row.tb_link.url }}</td>
                      <td>{{ row.agent }}</td>
                      <td>{{ row.create_at }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <div
                style="
                  position: fixed;
                  width: 100%;
                  bottom: 0px;
                  background-color: white;
                  margin-top: 10px;
                "
              >
                <div class="text-center">
                  <v-pagination
                    v-model="page"
                    :length="lastPage"
                    :total-visible="7"
                    @input="onPaginationChange"
                  ></v-pagination>
                </div>
              </div>
            </div>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-main>
</template>


<script>
import axios from 'axios';
console.log(process.env.VUE_APP_BASE_API_URL);
export default {
  data() {
    return {
      myMsg: 'this is just message',
      url: '',
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      shortUrl: null,
      toCopyUrl: '',
      isValid: false,
      urlRule: [
        (v) => !!v || 'URL is required',
        (v) => {
          let res = v.match(
            //eslint-disable-next-line
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
            // /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
          );
          this.isValid = res !== null;
          return (this.isValid && this.url !== '') || 'Invalid URL';
        },
      ],
      dialog: false,
      page: 1,
      accessLogList: [],
      lastPage: 1,
      hasMore: false,
    };
  },
  methods: {
    generateUrl: async function () {
      const res = await axios.post(`${process.env.VUE_APP_BASE_API_URL}/shorturl`, {
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
        function () {
          // copy this.toCopyUrl
          // console.log(`copy : ${this.toCopyUrl}`);
        },
        function (err) {
          console.error(err);
        },
      );
    },
    openAccessLogDialog: function () {
      this.dialog = true;
      this.getAccessLogDataTable(1);
    },
    getAccessLogDataTable: async function (page) {
      const { data } = await axios.get(`${process.env.VUE_APP_BASE_API_URL}/getaccesslog`, {
        params: {
          page: page,
        },
      });
      this.accessLogList = data.accessLogData.accessLogList;
      this.hasMore = data.accessLogData.hasMore;
      this.lastPage = data.accessLogData.lastPage;
    },
    onPaginationChange: function () {
      this.getAccessLogDataTable(this.page);
    },
  },
};
</script>