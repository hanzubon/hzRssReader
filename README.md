# hzRssReader

手元で使っている RSS Reader 一式のコードを公開しておく。2019年初頭にAngularとTypeScriptの味見のつもりで2週間ほどで書いたもので、自分が使う範囲の最低限の機能しかない。また、ドキュメンテーションとテストが壊滅的に全く整備されてないので実際に使い始めようとすると、かなり困るのでではないかと思う。

ということなので、デモサイトを動かしてみた。

[デモサイト](https://hzrss-demo.hanzubon.jp/login)

機能的には...

 * ユーザ情報を極力サーバ側に残さない設計
 * pubsubhubbub対応
 * PWA対応
 * OPMLのインポートには対応してる(ただ TinyTiny RSS が吐いたものでしか試してない)エクスポートはまだない
 * (Android等で)システムのdark/lightモード切り替えを見るはず

# TODOs

## 全体
 * unit test が全然ない(わら
 * ドキュメンテーション
 * DB 定義が db-migrate と その他で重複してるのでなんとかする

## worker
 * ディフォルトの更新頻度をなんらか設定できるようにすべきだろうなぁ
 * rss から更新頻度拾えるときは、それで調整する
 * DB 上から一定期間たった古いエントリを削除するような仕組み
 * ログ
 * Node.jsで実装してあるけど(コードツリーを分離して)Goかなんかで書き換えたい

## client
 * known user チェックを 設定ファイルにコーディングしてしまってある
   * サーバサイドに新規ユーザの登録ができるかどうかの設定があるので、本来はサーバ側でチェックさせるようにしないといけない
 * search
 * opml export
 * css まわりの整理
   * だいぶ雑に書き散らして component 側にあったほうがいいようなものが theme.scss にあったりしてる
   * scss に切り替える前に theme のことを無視して定義しちゃってるようなものがある
 * 国際化
 * 内部的な話だが ChangeDetectionStrategy を整理してもう少し速度あがらんかね?
   * ~~主にアニメーションのせいな気もしているが ちょっと重い気はする イマドキのミドルレンジのタブレットだと少しカクつく~~
   * だいぶ整理できたはず 基本的には OnPush になってる
 * cdk-virtual-scroll を使う???
   * scroll view port の高さ(itemSize) を px 単位で指定する必要があるので処置が面倒
   * さらに 今回のケースのように 内部のブツの高さが可変長の場合の処理に対応してない
   * 現状 そのへんをうまくハンドリングする autosize というパラメータを実装しているようだが 現状これもうまく動かない
   * しょうがないので 現状はそのへんを必死に実装してある ngx-virtual-scroller を使っている(4.0.2あたりからこれもなんだかバギーなのでどうしたものか...)
   * なのだけど cdk の virtual scroll がそのあたりうまく動くようになるなら 切り替えたい気はする(cdk 7.3.3 ではダメ)

## server
 * search
   * elasticsearchで実装したが構造的に微妙か。特に検索対象をelasticsearchに突っ込む処理がRSSの更新時とは非同期にバッチで処理してるんでそのへんは最低限整理したほうがいい。
 * common.ts に書き散らかしてある 各種雑なfunctionまわりの整理
 * SQL がかなり生で下記散らかしてあるのでどうにかしたい
 * API 自体を必要なものだけてきとーに書き散らかしてあって ほぼぜんぶ POST だったり定義もアレなのでどうにかする
 * ログ
   * とりあえずアクセスログは morgan でとるようにした
   * エラー系のログはどうするか? 現状 console.log で標準出力に垂れ流し
