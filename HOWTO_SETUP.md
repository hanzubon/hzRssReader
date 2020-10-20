1. 認証用 auth0.com のアカウントとアプリケーションの登録をする。
     * 種類は single page application。
     * CLIENTID と client secret が必要
     * Allowed Callback URLs, Allowed Logout URLs, Allowed Web Origins, Allowed Origins (CORS) あたりをこのサーバを動かす環境に適切にあわせとく。
     * auth0 の設定は現状 config/ 以下と src/environments 以下に重複してあるので注意

 2. DB に DB を作ってアクセスできるようにする。
     * mysql しか使えません
     * create table とかできる権限が必要
     * DBの設定も現状 database.json と config/ 以下に重複してあるので注意

 3. elasticsearch の設定
     * セットアップしなくても検索ができないだけのはず
     * analysis-icu と analysis-kuromoji plugin 要
     * 現状 logstash も使うので入れとく
     * examples/elasticsearch/example.json にindexのsettingのサンプルがあるのでそれを参考にindexを作成する(index名だけかえて kibana の dev console につっこめば okなはず。kibana 使わない場合は各自対処してください)
     * logstash を定期実行するように cron を設定(ある程度の頻度で実行されれば ok なので systemd-timerd とかでももちろん可)

 4. rabbitmq の設定
     * workerがリクエストをうけるのに rabbitmq 使うので queue を設定して config/ に反映

 5. log
     * server を動かす権限で書き込みができるように ログのディレクトリのpermissionを設定する

 6. databaseの作成
     * database.json を編集して 2. で設定したDBにアクセスするように書き換える
     * db-migrateを実行してdbを作成

 7. server/worker用の設定
     * config/ 以下の example を参考に各種設定をしとく

 8. app用の設定
     * app/environments/ 以下の example を参考に各種セットアップ

 9. build
     * npm run build で dists/ 以下に client server worker が作成されるはず
     * clientは利用する Webサーバから配信できるように配置
     * server は 現状 上記のWebサーバの /api 以下でアクセスできることを想定してるので、Webサーバを設定
     * worker は実際のRSSの取得と更新を行う
     * sub_workerはpubsubhubbunのsubになる。callback url に対して外部からアクセスできるようにすること
