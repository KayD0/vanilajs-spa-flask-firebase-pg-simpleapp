import { getCurrentUser, signOut } from "../services/firebase.js";
import { getProfile, updateProfile } from "../services/profile-api-service.js";

export default () => {
  // ビューがレンダリングされた後に呼び出される関数
  setTimeout(async () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const profileForm = document.getElementById("profileForm");
    const profileInfo = document.getElementById("profileInfo");
    const profileAlert = document.getElementById("profileAlert");
    
    // プロフィール情報を取得
    try {
      const result = await getProfile();
      if (result.success) {
        const profile = result.profile;
        
        // フォームに値を設定
        document.getElementById("displayName").value = profile.display_name || '';
        document.getElementById("bio").value = profile.bio || '';
        document.getElementById("location").value = profile.location || '';
        document.getElementById("website").value = profile.website || '';
        
        // プロフィール情報を表示
        if (profile.display_name) {
          document.getElementById("profileDisplayName").textContent = profile.display_name;
        }
        if (profile.bio) {
          document.getElementById("profileBio").textContent = profile.bio;
        } else {
          document.getElementById("bioContainer").classList.add("d-none");
        }
        if (profile.location) {
          document.getElementById("profileLocation").textContent = profile.location;
        } else {
          document.getElementById("locationContainer").classList.add("d-none");
        }
        if (profile.website) {
          document.getElementById("profileWebsite").href = profile.website.startsWith('http') ? profile.website : `https://${profile.website}`;
          document.getElementById("profileWebsite").textContent = profile.website;
        } else {
          document.getElementById("websiteContainer").classList.add("d-none");
        }
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    }
    
    // 編集ボタンのイベントリスナー
    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", () => {
        profileInfo.classList.add("d-none");
        profileForm.classList.remove("d-none");
      });
    }
    
    // キャンセルボタンのイベントリスナー
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", () => {
        profileForm.classList.add("d-none");
        profileInfo.classList.remove("d-none");
      });
    }
    
    // 保存ボタンのイベントリスナー
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", async () => {
        // ローディング状態を表示
        saveProfileBtn.disabled = true;
        saveProfileBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 保存中...';
        
        try {
          // フォームからデータを取得
          const profileData = {
            display_name: document.getElementById("displayName").value,
            bio: document.getElementById("bio").value,
            location: document.getElementById("location").value,
            website: document.getElementById("website").value
          };
          
          // プロフィールを更新
          const result = await updateProfile(profileData);
          
          if (result.success) {
            // 成功メッセージを表示
            profileAlert.textContent = 'プロフィールが更新されました';
            profileAlert.classList.remove('d-none', 'alert-danger');
            profileAlert.classList.add('alert-success');
            
            // プロフィール情報を更新
            const profile = result.profile;
            
            // 表示を更新
            document.getElementById("profileDisplayName").textContent = profile.display_name || getCurrentUser().email;
            
            if (profile.bio) {
              document.getElementById("profileBio").textContent = profile.bio;
              document.getElementById("bioContainer").classList.remove("d-none");
            } else {
              document.getElementById("bioContainer").classList.add("d-none");
            }
            
            if (profile.location) {
              document.getElementById("profileLocation").textContent = profile.location;
              document.getElementById("locationContainer").classList.remove("d-none");
            } else {
              document.getElementById("locationContainer").classList.add("d-none");
            }
            
            if (profile.website) {
              document.getElementById("profileWebsite").href = profile.website.startsWith('http') ? profile.website : `https://${profile.website}`;
              document.getElementById("profileWebsite").textContent = profile.website;
              document.getElementById("websiteContainer").classList.remove("d-none");
            } else {
              document.getElementById("websiteContainer").classList.add("d-none");
            }
            
            // フォームを非表示にしてプロフィール情報を表示
            profileForm.classList.add("d-none");
            profileInfo.classList.remove("d-none");
            
            // 3秒後にアラートを非表示
            setTimeout(() => {
              profileAlert.classList.add('d-none');
            }, 3000);
          }
        } catch (error) {
          console.error('プロフィール更新エラー:', error);
          
          // エラーメッセージを表示
          profileAlert.textContent = `エラー: ${error.message || 'プロフィールの更新に失敗しました'}`;
          profileAlert.classList.remove('d-none', 'alert-success');
          profileAlert.classList.add('alert-danger');
        } finally {
          // ボタンの状態をリセット
          saveProfileBtn.disabled = false;
          saveProfileBtn.textContent = '保存';
        }
      });
    }
    
    // ログアウトボタンのイベントリスナー
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        // ローディング状態を表示
        const originalBtnText = logoutBtn.textContent;
        logoutBtn.disabled = true;
        logoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 処理中...';
        
        // サインアウトを試みる
        const { error } = await signOut();
        
        // ボタンの状態をリセット
        logoutBtn.disabled = false;
        logoutBtn.textContent = originalBtnText;
        
        if (!error) {
          // サインアウト成功時にログインページにリダイレクト
          history.pushState("", "", "/login");
          window.dispatchEvent(new Event("popstate"));
        }
      });
    }
  }, 0);
  
  const user = getCurrentUser();
  
  if (!user) {
    // 認証されていない場合はログインにリダイレクト
    setTimeout(() => {
      history.pushState("", "", "/login");
      window.dispatchEvent(new Event("popstate"));
    }, 0);
    
    return /*html*/`
      <div class="alert alert-warning">
        このページを表示するにはログインが必要です。ログインページにリダイレクトしています...
      </div>
    `;
  }
  
  return /*html*/`
    <div class="row">
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header">
            <h2 class="card-title mb-0">ユーザープロフィール</h2>
          </div>
          
          <!-- アラート -->
          <div id="profileAlert" class="alert alert-success m-3 d-none"></div>
          
          <!-- プロフィール情報表示 -->
          <div id="profileInfo" class="card-body">
            <div class="mb-4">
              <h4 id="profileDisplayName">${user.email}</h4>
              <p><strong>メールアドレス:</strong> ${user.email}</p>
              <div id="bioContainer" class="mb-2">
                <p><strong>自己紹介:</strong> <span id="profileBio"></span></p>
              </div>
              <div id="locationContainer" class="mb-2">
                <p><strong>場所:</strong> <span id="profileLocation"></span></p>
              </div>
              <div id="websiteContainer" class="mb-2">
                <p><strong>ウェブサイト:</strong> <a id="profileWebsite" href="#" target="_blank"></a></p>
              </div>
            </div>
            
            <div class="d-flex">
              <button id="editProfileBtn" class="btn btn-primary me-2">プロフィール編集</button>
            </div>
          </div>
          
          <!-- プロフィール編集フォーム -->
          <div id="profileForm" class="card-body d-none">
            <form>
              <div class="mb-3">
                <label for="displayName" class="form-label">表示名</label>
                <input type="text" class="form-control" id="displayName" placeholder="表示名を入力">
              </div>
              <div class="mb-3">
                <label for="bio" class="form-label">自己紹介</label>
                <textarea class="form-control" id="bio" rows="3" placeholder="自己紹介を入力"></textarea>
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">場所</label>
                <input type="text" class="form-control" id="location" placeholder="場所を入力">
              </div>
              <div class="mb-3">
                <label for="website" class="form-label">ウェブサイト</label>
                <input type="text" class="form-control" id="website" placeholder="ウェブサイトを入力">
              </div>
              <div class="d-flex">
                <button type="button" id="saveProfileBtn" class="btn btn-success me-2">保存</button>
                <button type="button" id="cancelEditBtn" class="btn btn-secondary">キャンセル</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card bg-light">
          <div class="card-header">
            <h5 class="card-title mb-0">アカウント設定</h5>
          </div>
          <div class="list-group list-group-flush">
            <a href="#" class="list-group-item list-group-item-action">パスワード変更</a>
            <a href="#" class="list-group-item list-group-item-action disabled">プライバシー設定</a>
          </div>
        </div>
      </div>
    </div>
  `;
};
