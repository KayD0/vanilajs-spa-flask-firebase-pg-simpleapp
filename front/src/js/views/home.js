export default () => /*html*/`
    <div class="row mb-4">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h1 class="card-title">ユーザープロフィールアプリ</h1>
                    <p class="card-text">シンプルなユーザープロフィール管理アプリケーション</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">機能一覧</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ユーザー登録
                            <span class="badge bg-success rounded-pill">利用可能</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ログイン/ログアウト
                            <span class="badge bg-success rounded-pill">利用可能</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            プロフィール編集
                            <span class="badge bg-success rounded-pill">利用可能</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">使い方</h5>
                </div>
                <div class="card-body">
                    <ol class="list-group list-group-numbered">
                        <li class="list-group-item">右上の「登録」からアカウントを作成</li>
                        <li class="list-group-item">作成したアカウントでログイン</li>
                        <li class="list-group-item">プロフィールページで個人情報を編集</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
`;
