// お問い合わせフォームのJavaScript処理
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm || !formMessage) {
        console.error('フォーム要素が見つかりません');
        return;
    }

    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('フォーム送信開始');
        
        // メッセージをクリア
        formMessage.textContent = '';
        formMessage.className = '';

        // プライバシーポリシーの同意チェック
        const privacyCheckbox = document.getElementById('privacy_policy');
        if (!privacyCheckbox.checked) {
            console.log('プライバシーポリシー未同意');
            showMessage('プライバシーポリシーに同意してください。', 'error');
            return;
        }

        // フォームデータを取得
        const formData = getFormData();
        console.log('フォームデータ:', formData);
        
        // 必須項目のバリデーション
        if (!validateRequiredFields(formData)) {
            console.log('必須項目不足');
            showMessage('必須項目をすべて入力してください。', 'error');
            return;
        }

        // API送信用のペイロードを作成
        const payload = createApiPayload(formData);
        console.log('送信ペイロード:', payload);

        // 送信処理
        await submitForm(payload);
    });

    /**
     * フォームデータを取得
     */
    function getFormData() {
        return {
            companyName: document.getElementById('companyName').value.trim(),
            department: document.getElementById('department').value.trim(),
            position: document.getElementById('position').value.trim(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };
    }

    /**
     * 必須項目のバリデーション
     */
    function validateRequiredFields(formData) {
        const requiredFields = ['companyName', 'name', 'email', 'phone'];
        return requiredFields.every(field => formData[field] && formData[field].length > 0);
    }

    /**
     * API送信用のペイロードを作成
     * API Gatewayのマッピングに合わせる
     */
    function createApiPayload(formData) {
        return {
            companyName: formData.companyName,
            department: formData.department,
            position: formData.position,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        };
    }

    /**
     * フォーム送信処理
     */
    async function submitForm(payload) {
        console.log('API送信開始');
        showMessage('送信中...', 'loading');

        try {
            const response = await fetch('https://ekfayrbc9l.execute-api.ap-northeast-1.amazonaws.com/v1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log('API応答ステータス:', response.status);

            if (response.ok) {
                const responseData = await response.json();
                console.log('成功応答:', responseData);
                showMessage('お問い合わせありがとうございます。送信されました。', 'success');
                contactForm.reset();
            } else {
                let errorMessage = '送信に失敗しました。';
                try {
                    const errorData = await response.json();
                    console.log('エラー応答:', errorData);
                    errorMessage += ' ' + (errorData.message || `エラーコード: ${response.status}`);
                } catch (e) {
                    console.log('エラー応答の解析に失敗:', e);
                    errorMessage += ` エラーコード: ${response.status}`;
                }
                showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error('送信エラー:', error);
            showMessage('送信中にエラーが発生しました。インターネット接続を確認してください。', 'error');
        }
    }

    /**
     * メッセージ表示
     */
    function showMessage(message, type) {
        formMessage.textContent = message;
        
        // メッセージタイプに応じてCSSクラスを設定
        switch (type) {
            case 'success':
                formMessage.className = 'mt-4 text-center text-green-600 font-medium';
                break;
            case 'error':
                formMessage.className = 'mt-4 text-center text-red-600 font-medium';
                break;
            case 'loading':
                formMessage.className = 'mt-4 text-center text-blue-600 font-medium';
                break;
            default:
                formMessage.className = 'mt-4 text-center text-gray-600 font-medium';
        }
    }
});
