function initMap() {
    let lat, lng, i;
    const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"

    navigator.geolocation.getCurrentPosition((position) => {

        /*緯度経度の取得
        pcの現在位置がおかしいため固定する*/

        /*lat = position.coords.latitude;
        lng = position.coords.longitude;*/
        lat = 35.02725763144587;
        lng = 137.02609432481168;

        console.log(lat, lng);

        // 緯度経度の取得
        latLng = new google.maps.LatLng(lat, lng);

        // 地図の作成
        map = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            zoom: 16
        });



        const params = {
            keyid: "9be00fbaa95f4bcc1b759ab2072385e0",
            latitude: lat,
            longitude: lng,
            range: 5,
            hit_per_page: 20
        }


        $.getJSON(url, params, result => {
            console.log(result.total_hit_count);
            console.log(result.hit_per_page);
            console.log(result.rest.length);

            gurunabiTable.result=result;
            app.showResult(result);
        })

    }, () => {
        alert('位置情報取得に失敗しました');
    });
}

/*******************************************************
 * コンポーネント
 ********************************************************/
const gurunabiData = {
    props: ["item","index"],
    template: `
        <tr>
            <td>{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>{{item.opentime}}</td>
            <td>{{item.tel}}</td>
            <td><a :href="item.url">pc版サイト</a></td>
            <td><a :href="item.url_mobile">スマホ版サイト</a></td>
            <td>{{item.access.station}}{{item.access.walk}}分</td>
            <td>{{item.code.prefname}}</td>
            <td>{{item.pr.pr_short}}</td>
            <td><img :src="{{item.image_url.shop_image1}}"></td>
            <td><img :src="{{item.image_url.shop_image2}}"></td>
            <td>{{item.e_money}}</td>
        </tr>
    `
}

const gurunabiTable = {
    data:()=>{
        return {
            result:"",
        };
    },
    template: `
        <table id="table" border="1">
            <tr>
                <th>番号</th>
                <th>店舗名</th>
                <th>営業時間</th>
                <th>電話番号</th>
                <th>pcURL</th>
                <th>phoneURL</th>
                <th>アクセス</th>
                <th>都道府県</th>
                <th>PR</th>
                <th>画像1</th>
                <th>画像2</th>
                <th>電子マネー</th>
            </tr>
            <gurunabi-data initial-item="result.item[0]" :initial-index="1"></gurunabi-data>
        </table>
    `,
    components:{
        "gurunabi-data":gurunabiData
    }
}

/*******************************************************
 * Vueインスタンス
 ********************************************************/
const app = new Vue({
    el: "#app",
    data: {

    },
    components: {
        "gurunabi-table": gurunabiTable
    },
    computed: {
        //検索結果を出力
        showResult(result) {
            //該当件数
            console.log(result.tatal_hit_count);
            $("#total").text(result.total_hit_count + "件");

            let i = 1;

            result.rest.map((item, index) => {
                //表に要素を追加
                $("#table").append(`
                    <tr>
                        <td>${index+1}</td>
                        <td>${item.name}</td>
                        <td>${item.opentime}</td>
                        <td>${item.tel}</td>
                        <td><a href="${item.url}">pc版サイト</a></td>
                        <td><a href="${item.url_mobile}">スマホ版サイト</a></td>
                        <td>${item.access.station}${item.access.walk}分</td>
                        <td>${item.code.prefname}</td>
                        <td>${item.pr.pr_short}</td>
                        <td><img src="${item.image_url.shop_image1}"></td>
                        <td><img src="${item.image_url.shop_image2}"></td>
                        <td>${item.e_money}</td>
                    </tr>
                `);

                //緯度経度の確認
                if (item.latitude) {
                    console.log(item.latitude)
                }
                else {
                    console.log("緯度なし");
                };
                if (item.longitude) {
                    console.log(item.longitude)
                }
                else {
                    console.log("経度なし");
                };

                this.showMarker(item, index);

            });
        },

        //地図上に店の場所を表示
        showMarker(item, index) {
            //地図中に各店舗のマーカーを作成
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.latitude, item.longitude),
                title: item.name,
                label: {
                    text: String(index + 1),
                    color: "#fff",
                    fontWeight: 'bold',
                    fontSize: '14px'
                },
            });

            // マーカーを地図中にセットする
            marker.setMap(map);
        }
    },

})
