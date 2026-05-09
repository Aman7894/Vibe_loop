import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  English: {
    translation: {
      // Navbar & Sidebar
      "Home": "Home",
      "Explore": "Explore",
      "Reels": "Reels",
      "Messages": "Messages",
      "Notifications": "Notifications",
      "Profile": "Profile",
      "Settings": "Settings",
      "Upload Reel": "Upload Reel",

      // Footer
      "Follow Us": "Follow Us",
      "Legal & Policies": "Legal & Policies",
      "Support": "Support",
      "Language": "Language",
      "Region": "Region",
      "Select": "Select",
      "Privacy Policy": "Privacy Policy",
      "Terms of Service": "Terms of Service",
      "Cookie Policy": "Cookie Policy",
      "Help Center": "Help Center",
      "Report a Problem": "Report a Problem",
      "Contact Support": "Contact Support",

      // Layout - right sidebar
      "Suggested for you": "Suggested for you",
      "Platform updates": "Platform updates",
      "Follow": "Follow",

      // Home page
      "No posts yet. Be the first to create one!": "No posts yet. Be the first to create one!",

      // Create Post
      "What's happening?": "What's happening?",
      "Post": "Post",
      "Posting...": "Posting...",

      // Post Card
      "Unknown User": "Unknown User",
      "Just now": "Just now",
      "Sharing is not supported on this browser.": "Sharing is not supported on this browser.",

      // Comment Section
      "Add a comment...": "Add a comment...",
      "No comments yet. Be the first!": "No comments yet. Be the first!",

      // DM Page
      "Search friends...": "Search friends...",
      "Tap to chat": "Tap to chat",
      "No users found.": "No users found.",
      "Online": "Online",
      "Say hello!": "Say hello!",
      "Start the conversation with": "Start the conversation with",
      "Type your message...": "Type your message...",
      "Your Messages": "Your Messages",
      "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.": "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.",

      // Profile
      "Loading...": "Loading...",
      "Followers": "Followers",
      "Following": "Following",
      "Toggle Follow": "Toggle Follow",
      "Edit Profile": "Edit Profile",
      "Posts": "Posts",
      "No posts yet.": "No posts yet.",

      // Notifications
      "No notifications yet.": "No notifications yet.",

      // Reels Feed
      "Loading your feed...": "Loading your feed...",
      "Shared successfully!": "Shared successfully!",
      "Link copied to clipboard!": "Link copied to clipboard!",
      "Comments panel opening... (coming soon)": "Comments panel opening... (coming soon)",
      "No reels found yet. Upload one!": "No reels found yet. Upload one!",

      // Upload Reel Modal
      "Click to select a video": "Click to select a video",
      "MP4, WebM up to 50MB": "MP4, WebM up to 50MB",
      "Caption": "Caption",
      "Write a catchy caption...": "Write a catchy caption...",
      "Post Reel": "Post Reel",
      "Uploading...": "Uploading...",

      // Video Call
      "Waiting for the other person to join...": "Waiting for the other person to join...",

      // Login
      "Discover the things you love.": "Discover the things you love.",
      "Connect with friends, share your universe, and explore what's happening around the world right now.": "Connect with friends, share your universe, and explore what's happening around the world right now.",
      "Create a Page": "Create a Page",
      "for a celebrity, brand or business.": "for a celebrity, brand or business.",

      // Copyright
      "Systems Online": "Systems Online",

      // Notification actions
      "liked your post.": "liked your post.",
      "commented on your post.": "commented on your post.",
      "started following you.": "started following you.",
      "sent you a message.": "sent you a message.",
      "liked your reel.": "liked your reel.",
      "Someone": "Someone",
      "New notification": "New notification",

      // Default profile bio
      "Building awesome things! 🚀": "Building awesome things! 🚀"
    }
  },
  Hindi: {
    translation: {
      "Home": "होम",
      "Explore": "एक्सप्लोर",
      "Reels": "रील्स",
      "Messages": "संदेश",
      "Notifications": "सूचनाएं",
      "Profile": "प्रोफ़ाइल",
      "Settings": "सेटिंग्स",
      "Upload Reel": "रील अपलोड करें",

      "Follow Us": "हमें फॉलो करें",
      "Legal & Policies": "कानूनी और नीतियां",
      "Support": "सहायता",
      "Language": "भाषा",
      "Region": "क्षेत्र",
      "Select": "चुनें",
      "Privacy Policy": "गोपनीयता नीति",
      "Terms of Service": "सेवा की शर्तें",
      "Cookie Policy": "कुकी नीति",
      "Help Center": "सहायता केंद्र",
      "Report a Problem": "समस्या की रिपोर्ट करें",
      "Contact Support": "संपर्क सहायता",

      "Suggested for you": "आपके लिए सुझाव",
      "Platform updates": "प्लेटफ़ॉर्म अपडेट",
      "Follow": "फॉलो करें",

      "No posts yet. Be the first to create one!": "अभी तक कोई पोस्ट नहीं। पहली पोस्ट बनाएं!",

      "What's happening?": "क्या हो रहा है?",
      "Post": "पोस्ट",
      "Posting...": "पोस्ट हो रहा है...",

      "Unknown User": "अज्ञात उपयोगकर्ता",
      "Just now": "अभी अभी",
      "Sharing is not supported on this browser.": "इस ब्राउज़र पर शेयरिंग समर्थित नहीं है।",

      "Add a comment...": "टिप्पणी जोड़ें...",
      "No comments yet. Be the first!": "अभी तक कोई टिप्पणी नहीं। पहले बनें!",

      "Search friends...": "दोस्तों को खोजें...",
      "Tap to chat": "चैट करने के लिए टैप करें",
      "No users found.": "कोई उपयोगकर्ता नहीं मिला।",
      "Online": "ऑनलाइन",
      "Say hello!": "नमस्ते कहें!",
      "Start the conversation with": "बातचीत शुरू करें",
      "Type your message...": "अपना संदेश टाइप करें...",
      "Your Messages": "आपके संदेश",
      "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.": "चैट करने, रील शेयर करने और तुरंत वीडियो कॉल शुरू करने के लिए साइडबार से किसी दोस्त पर टैप करें।",

      "Loading...": "लोड हो रहा है...",
      "Followers": "फ़ॉलोअर्स",
      "Following": "फ़ॉलोइंग",
      "Toggle Follow": "फॉलो / अनफॉलो",
      "Edit Profile": "प्रोफ़ाइल संपादित करें",
      "Posts": "पोस्ट",
      "No posts yet.": "अभी तक कोई पोस्ट नहीं।",

      "No notifications yet.": "अभी तक कोई सूचना नहीं।",

      "Loading your feed...": "आपकी फ़ीड लोड हो रही है...",
      "Shared successfully!": "सफलतापूर्वक शेयर किया गया!",
      "Link copied to clipboard!": "लिंक क्लिपबोर्ड पर कॉपी किया गया!",
      "Comments panel opening... (coming soon)": "टिप्पणी पैनल खुल रहा है... (जल्द आ रहा है)",
      "No reels found yet. Upload one!": "अभी तक कोई रील नहीं मिली। एक अपलोड करें!",

      "Click to select a video": "वीडियो चुनने के लिए क्लिक करें",
      "MP4, WebM up to 50MB": "MP4, WebM 50MB तक",
      "Caption": "कैप्शन",
      "Write a catchy caption...": "एक आकर्षक कैप्शन लिखें...",
      "Post Reel": "रील पोस्ट करें",
      "Uploading...": "अपलोड हो रहा है...",

      "Waiting for the other person to join...": "दूसरे व्यक्ति के शामिल होने की प्रतीक्षा है...",

      "Discover the things you love.": "उन चीज़ों की खोज करें जो आपको पसंद हैं।",
      "Connect with friends, share your universe, and explore what's happening around the world right now.": "दोस्तों से जुड़ें, अपनी दुनिया साझा करें, और अभी दुनिया भर में क्या हो रहा है एक्सप्लोर करें।",
      "Create a Page": "एक पेज बनाएं",
      "for a celebrity, brand or business.": "किसी सेलिब्रिटी, ब्रांड या व्यवसाय के लिए।",

      "Systems Online": "सिस्टम ऑनलाइन",

      "liked your post.": "ने आपकी पोस्ट पसंद की।",
      "commented on your post.": "ने आपकी पोस्ट पर टिप्पणी की।",
      "started following you.": "ने आपको फॉलो करना शुरू किया।",
      "sent you a message.": "ने आपको एक संदेश भेजा।",
      "liked your reel.": "ने आपकी रील पसंद की।",
      "Someone": "किसी",
      "New notification": "नई सूचना",

      "Building awesome things! 🚀": "शानदार चीज़ें बना रहे हैं! 🚀"
    }
  },
  Spanish: {
    translation: {
      "Home": "Inicio",
      "Explore": "Explorar",
      "Reels": "Reels",
      "Messages": "Mensajes",
      "Notifications": "Notificaciones",
      "Profile": "Perfil",
      "Settings": "Ajustes",
      "Upload Reel": "Subir Reel",

      "Follow Us": "Síganos",
      "Legal & Policies": "Legal y Políticas",
      "Support": "Soporte",
      "Language": "Idioma",
      "Region": "Región",
      "Select": "Seleccionar",
      "Privacy Policy": "Política de Privacidad",
      "Terms of Service": "Términos de Servicio",
      "Cookie Policy": "Política de Cookies",
      "Help Center": "Centro de Ayuda",
      "Report a Problem": "Reportar un Problema",
      "Contact Support": "Contactar Soporte",

      "Suggested for you": "Sugeridos para ti",
      "Platform updates": "Actualizaciones de la plataforma",
      "Follow": "Seguir",

      "No posts yet. Be the first to create one!": "Aún no hay publicaciones. ¡Sé el primero en crear una!",

      "What's happening?": "¿Qué está pasando?",
      "Post": "Publicar",
      "Posting...": "Publicando...",

      "Unknown User": "Usuario desconocido",
      "Just now": "Ahora mismo",
      "Sharing is not supported on this browser.": "Compartir no es compatible con este navegador.",

      "Add a comment...": "Agregar un comentario...",
      "No comments yet. Be the first!": "Aún no hay comentarios. ¡Sé el primero!",

      "Search friends...": "Buscar amigos...",
      "Tap to chat": "Toca para chatear",
      "No users found.": "No se encontraron usuarios.",
      "Online": "En línea",
      "Say hello!": "¡Di hola!",
      "Start the conversation with": "Inicia la conversación con",
      "Type your message...": "Escribe tu mensaje...",
      "Your Messages": "Tus Mensajes",
      "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.": "Toca a un amigo de la barra lateral para chatear, compartir reels y comenzar videollamadas al instante.",

      "Loading...": "Cargando...",
      "Followers": "Seguidores",
      "Following": "Siguiendo",
      "Toggle Follow": "Seguir / Dejar de seguir",
      "Edit Profile": "Editar Perfil",
      "Posts": "Publicaciones",
      "No posts yet.": "Aún no hay publicaciones.",

      "No notifications yet.": "Aún no hay notificaciones.",

      "Loading your feed...": "Cargando tu feed...",
      "Shared successfully!": "¡Compartido con éxito!",
      "Link copied to clipboard!": "¡Enlace copiado al portapapeles!",
      "Comments panel opening... (coming soon)": "Panel de comentarios abriendo... (muy pronto)",
      "No reels found yet. Upload one!": "Aún no hay reels. ¡Sube uno!",

      "Click to select a video": "Haz clic para seleccionar un video",
      "MP4, WebM up to 50MB": "MP4, WebM hasta 50MB",
      "Caption": "Descripción",
      "Write a catchy caption...": "Escribe una descripción llamativa...",
      "Post Reel": "Publicar Reel",
      "Uploading...": "Subiendo...",

      "Waiting for the other person to join...": "Esperando que la otra persona se una...",

      "Discover the things you love.": "Descubre las cosas que amas.",
      "Connect with friends, share your universe, and explore what's happening around the world right now.": "Conéctate con amigos, comparte tu universo y explora lo que está pasando en el mundo ahora mismo.",
      "Create a Page": "Crear una Página",
      "for a celebrity, brand or business.": "para un famoso, marca o negocio.",

      "Systems Online": "Sistemas en línea",

      "liked your post.": "le dio me gusta a tu publicación.",
      "commented on your post.": "comentó en tu publicación.",
      "started following you.": "comenzó a seguirte.",
      "sent you a message.": "te envió un mensaje.",
      "liked your reel.": "le dio me gusta a tu reel.",
      "Someone": "Alguien",
      "New notification": "Nueva notificación",

      "Building awesome things! 🚀": "¡Construyendo cosas increíbles! 🚀"
    }
  },
  French: {
    translation: {
      "Home": "Accueil",
      "Explore": "Explorer",
      "Reels": "Reels",
      "Messages": "Messages",
      "Notifications": "Notifications",
      "Profile": "Profil",
      "Settings": "Paramètres",
      "Upload Reel": "Télécharger un Reel",

      "Follow Us": "Suivez-nous",
      "Legal & Policies": "Juridique et Politiques",
      "Support": "Assistance",
      "Language": "Langue",
      "Region": "Région",
      "Select": "Sélectionnez",
      "Privacy Policy": "Politique de Confidentialité",
      "Terms of Service": "Conditions d'Utilisation",
      "Cookie Policy": "Politique de Cookies",
      "Help Center": "Centre d'Aide",
      "Report a Problem": "Signaler un Problème",
      "Contact Support": "Contacter l'Assistance",

      "Suggested for you": "Suggéré pour vous",
      "Platform updates": "Mises à jour de la plateforme",
      "Follow": "Suivre",

      "No posts yet. Be the first to create one!": "Aucune publication pour le moment. Soyez le premier à en créer une !",

      "What's happening?": "Quoi de neuf ?",
      "Post": "Publier",
      "Posting...": "Publication...",

      "Unknown User": "Utilisateur inconnu",
      "Just now": "À l'instant",
      "Sharing is not supported on this browser.": "Le partage n'est pas pris en charge sur ce navigateur.",

      "Add a comment...": "Ajouter un commentaire...",
      "No comments yet. Be the first!": "Aucun commentaire pour l'instant. Soyez le premier !",

      "Search friends...": "Rechercher des amis...",
      "Tap to chat": "Appuyez pour discuter",
      "No users found.": "Aucun utilisateur trouvé.",
      "Online": "En ligne",
      "Say hello!": "Dites bonjour !",
      "Start the conversation with": "Commencez la conversation avec",
      "Type your message...": "Tapez votre message...",
      "Your Messages": "Vos Messages",
      "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.": "Appuyez sur un ami dans la barre latérale pour discuter, partager des reels et démarrer des appels vidéo instantanément.",

      "Loading...": "Chargement...",
      "Followers": "Abonnés",
      "Following": "Abonnements",
      "Toggle Follow": "Suivre / Ne plus suivre",
      "Edit Profile": "Modifier le Profil",
      "Posts": "Publications",
      "No posts yet.": "Aucune publication pour le moment.",

      "No notifications yet.": "Aucune notification pour le moment.",

      "Loading your feed...": "Chargement de votre fil...",
      "Shared successfully!": "Partagé avec succès !",
      "Link copied to clipboard!": "Lien copié dans le presse-papiers !",
      "Comments panel opening... (coming soon)": "Ouverture du panneau de commentaires... (bientôt disponible)",
      "No reels found yet. Upload one!": "Aucun reel trouvé. Téléchargez-en un !",

      "Click to select a video": "Cliquez pour sélectionner une vidéo",
      "MP4, WebM up to 50MB": "MP4, WebM jusqu'à 50 Mo",
      "Caption": "Légende",
      "Write a catchy caption...": "Écrivez une légende accrocheuse...",
      "Post Reel": "Publier le Reel",
      "Uploading...": "Téléchargement...",

      "Waiting for the other person to join...": "En attente de l'autre personne...",

      "Discover the things you love.": "Découvrez les choses que vous aimez.",
      "Connect with friends, share your universe, and explore what's happening around the world right now.": "Connectez-vous avec des amis, partagez votre univers et explorez ce qui se passe dans le monde en ce moment.",
      "Create a Page": "Créer une Page",
      "for a celebrity, brand or business.": "pour une célébrité, marque ou entreprise.",

      "Systems Online": "Systèmes en ligne",

      "liked your post.": "a aimé votre publication.",
      "commented on your post.": "a commenté votre publication.",
      "started following you.": "a commencé à vous suivre.",
      "sent you a message.": "vous a envoyé un message.",
      "liked your reel.": "a aimé votre reel.",
      "Someone": "Quelqu'un",
      "New notification": "Nouvelle notification",

      "Building awesome things! 🚀": "Construire des choses géniales ! 🚀"
    }
  },
  Japanese: {
    translation: {
      "Home": "ホーム",
      "Explore": "探索",
      "Reels": "リール",
      "Messages": "メッセージ",
      "Notifications": "通知",
      "Profile": "プロフィール",
      "Settings": "設定",
      "Upload Reel": "リールをアップロード",

      "Follow Us": "フォローする",
      "Legal & Policies": "法的事項とポリシー",
      "Support": "サポート",
      "Language": "言語",
      "Region": "地域",
      "Select": "選択",
      "Privacy Policy": "プライバシーポリシー",
      "Terms of Service": "利用規約",
      "Cookie Policy": "クッキーポリシー",
      "Help Center": "ヘルプセンター",
      "Report a Problem": "問題を報告",
      "Contact Support": "サポートに連絡",

      "Suggested for you": "おすすめ",
      "Platform updates": "プラットフォームの更新",
      "Follow": "フォロー",

      "No posts yet. Be the first to create one!": "まだ投稿はありません。最初の投稿をしましょう！",

      "What's happening?": "いまどうしてる？",
      "Post": "投稿",
      "Posting...": "投稿中...",

      "Unknown User": "不明なユーザー",
      "Just now": "たった今",
      "Sharing is not supported on this browser.": "このブラウザでは共有がサポートされていません。",

      "Add a comment...": "コメントを追加...",
      "No comments yet. Be the first!": "まだコメントはありません。最初のコメントを！",

      "Search friends...": "友達を検索...",
      "Tap to chat": "タップしてチャット",
      "No users found.": "ユーザーが見つかりません。",
      "Online": "オンライン",
      "Say hello!": "こんにちは！",
      "Start the conversation with": "会話を始めましょう",
      "Type your message...": "メッセージを入力...",
      "Your Messages": "あなたのメッセージ",
      "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.": "サイドバーから友達をタップして、チャット、リール共有、ビデオ通話を楽しみましょう。",

      "Loading...": "読み込み中...",
      "Followers": "フォロワー",
      "Following": "フォロー中",
      "Toggle Follow": "フォロー切り替え",
      "Edit Profile": "プロフィール編集",
      "Posts": "投稿",
      "No posts yet.": "まだ投稿はありません。",

      "No notifications yet.": "まだ通知はありません。",

      "Loading your feed...": "フィードを読み込んでいます...",
      "Shared successfully!": "共有に成功しました！",
      "Link copied to clipboard!": "リンクがクリップボードにコピーされました！",
      "Comments panel opening... (coming soon)": "コメントパネルを開いています...（近日公開）",
      "No reels found yet. Upload one!": "リールがまだありません。アップロードしましょう！",

      "Click to select a video": "クリックして動画を選択",
      "MP4, WebM up to 50MB": "MP4、WebM 最大50MB",
      "Caption": "キャプション",
      "Write a catchy caption...": "魅力的なキャプションを書いてください...",
      "Post Reel": "リールを投稿",
      "Uploading...": "アップロード中...",

      "Waiting for the other person to join...": "相手の参加を待っています...",

      "Discover the things you love.": "あなたの好きなものを見つけよう。",
      "Connect with friends, share your universe, and explore what's happening around the world right now.": "友達とつながり、あなたの世界を共有し、今世界で何が起こっているかを探索しましょう。",
      "Create a Page": "ページを作成",
      "for a celebrity, brand or business.": "有名人、ブランド、またはビジネスのために。",

      "Systems Online": "システムオンライン",

      "liked your post.": "があなたの投稿にいいねしました。",
      "commented on your post.": "があなたの投稿にコメントしました。",
      "started following you.": "があなたをフォローし始めました。",
      "sent you a message.": "があなたにメッセージを送りました。",
      "liked your reel.": "があなたのリールにいいねしました。",
      "Someone": "誰か",
      "New notification": "新しい通知",

      "Building awesome things! 🚀": "素晴らしいものを作っています！🚀"
    }
  },
  German: {
    translation: {
      "Home": "Startseite",
      "Explore": "Entdecken",
      "Reels": "Reels",
      "Messages": "Nachrichten",
      "Notifications": "Benachrichtigungen",
      "Profile": "Profil",
      "Settings": "Einstellungen",
      "Upload Reel": "Reel hochladen",

      "Follow Us": "Folgen Sie uns",
      "Legal & Policies": "Rechtliches & Richtlinien",
      "Support": "Unterstützung",
      "Language": "Sprache",
      "Region": "Region",
      "Select": "Auswählen",
      "Privacy Policy": "Datenschutzrichtlinie",
      "Terms of Service": "Nutzungsbedingungen",
      "Cookie Policy": "Cookie-Richtlinie",
      "Help Center": "Hilfezentrum",
      "Report a Problem": "Problem melden",
      "Contact Support": "Support kontaktieren",

      "Suggested for you": "Vorschläge für dich",
      "Platform updates": "Plattform-Updates",
      "Follow": "Folgen",

      "No posts yet. Be the first to create one!": "Noch keine Beiträge. Sei der Erste!",

      "What's happening?": "Was passiert gerade?",
      "Post": "Posten",
      "Posting...": "Wird gepostet...",

      "Unknown User": "Unbekannter Benutzer",
      "Just now": "Gerade eben",
      "Sharing is not supported on this browser.": "Teilen wird von diesem Browser nicht unterstützt.",

      "Add a comment...": "Kommentar hinzufügen...",
      "No comments yet. Be the first!": "Noch keine Kommentare. Sei der Erste!",

      "Search friends...": "Freunde suchen...",
      "Tap to chat": "Zum Chatten tippen",
      "No users found.": "Keine Benutzer gefunden.",
      "Online": "Online",
      "Say hello!": "Sag Hallo!",
      "Start the conversation with": "Starte die Unterhaltung mit",
      "Type your message...": "Nachricht eingeben...",
      "Your Messages": "Deine Nachrichten",
      "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.": "Tippe auf einen Freund in der Seitenleiste zum Chatten, Reels teilen und sofort Videoanrufe starten.",

      "Loading...": "Wird geladen...",
      "Followers": "Follower",
      "Following": "Folgt",
      "Toggle Follow": "Folgen / Entfolgen",
      "Edit Profile": "Profil bearbeiten",
      "Posts": "Beiträge",
      "No posts yet.": "Noch keine Beiträge.",

      "No notifications yet.": "Noch keine Benachrichtigungen.",

      "Loading your feed...": "Dein Feed wird geladen...",
      "Shared successfully!": "Erfolgreich geteilt!",
      "Link copied to clipboard!": "Link in Zwischenablage kopiert!",
      "Comments panel opening... (coming soon)": "Kommentarbereich öffnet sich... (bald verfügbar)",
      "No reels found yet. Upload one!": "Noch keine Reels gefunden. Lade eins hoch!",

      "Click to select a video": "Klicke, um ein Video auszuwählen",
      "MP4, WebM up to 50MB": "MP4, WebM bis zu 50MB",
      "Caption": "Beschreibung",
      "Write a catchy caption...": "Schreibe eine eingängige Beschreibung...",
      "Post Reel": "Reel posten",
      "Uploading...": "Wird hochgeladen...",

      "Waiting for the other person to join...": "Warte auf die andere Person...",

      "Discover the things you love.": "Entdecke die Dinge, die du liebst.",
      "Connect with friends, share your universe, and explore what's happening around the world right now.": "Verbinde dich mit Freunden, teile dein Universum und entdecke, was gerade auf der Welt passiert.",
      "Create a Page": "Seite erstellen",
      "for a celebrity, brand or business.": "für einen Star, eine Marke oder ein Unternehmen.",

      "Systems Online": "Systeme online",

      "liked your post.": "hat deinen Beitrag geliked.",
      "commented on your post.": "hat deinen Beitrag kommentiert.",
      "started following you.": "folgt dir jetzt.",
      "sent you a message.": "hat dir eine Nachricht gesendet.",
      "liked your reel.": "hat dein Reel geliked.",
      "Someone": "Jemand",
      "New notification": "Neue Benachrichtigung",

      "Building awesome things! 🚀": "Tolle Dinge bauen! 🚀"
    }
  },
  Arabic: {
    translation: {
      "Home": "الرئيسية",
      "Explore": "استكشف",
      "Reels": "ريلز",
      "Messages": "الرسائل",
      "Notifications": "الإشعارات",
      "Profile": "الملف الشخصي",
      "Settings": "الإعدادات",
      "Upload Reel": "تحميل ريل",

      "Follow Us": "تابعنا",
      "Legal & Policies": "السياسات القانونية",
      "Support": "الدعم",
      "Language": "اللغة",
      "Region": "المنطقة",
      "Select": "اختر",
      "Privacy Policy": "سياسة الخصوصية",
      "Terms of Service": "شروط الخدمة",
      "Cookie Policy": "سياسة ملفات الارتباط",
      "Help Center": "مركز المساعدة",
      "Report a Problem": "الإبلاغ عن مشكلة",
      "Contact Support": "اتصل بالدعم",

      "Suggested for you": "مقترح لك",
      "Platform updates": "تحديثات المنصة",
      "Follow": "متابعة",

      "No posts yet. Be the first to create one!": "لا توجد منشورات بعد. كن أول من ينشئ واحدة!",

      "What's happening?": "ماذا يحدث؟",
      "Post": "نشر",
      "Posting...": "جاري النشر...",

      "Unknown User": "مستخدم غير معروف",
      "Just now": "الآن",
      "Sharing is not supported on this browser.": "المشاركة غير مدعومة في هذا المتصفح.",

      "Add a comment...": "أضف تعليقاً...",
      "No comments yet. Be the first!": "لا توجد تعليقات بعد. كن الأول!",

      "Search friends...": "ابحث عن أصدقاء...",
      "Tap to chat": "انقر للدردشة",
      "No users found.": "لم يتم العثور على مستخدمين.",
      "Online": "متصل",
      "Say hello!": "قل مرحباً!",
      "Start the conversation with": "ابدأ المحادثة مع",
      "Type your message...": "اكتب رسالتك...",
      "Your Messages": "رسائلك",
      "Tap on a friend from the sidebar to chat, share reels, and start video calls instantly.": "انقر على صديق من الشريط الجانبي للدردشة ومشاركة الريلز وبدء مكالمات الفيديو فوراً.",

      "Loading...": "جاري التحميل...",
      "Followers": "المتابعون",
      "Following": "يتابع",
      "Toggle Follow": "متابعة / إلغاء المتابعة",
      "Edit Profile": "تعديل الملف الشخصي",
      "Posts": "المنشورات",
      "No posts yet.": "لا توجد منشورات بعد.",

      "No notifications yet.": "لا توجد إشعارات بعد.",

      "Loading your feed...": "جاري تحميل خلاصتك...",
      "Shared successfully!": "تمت المشاركة بنجاح!",
      "Link copied to clipboard!": "تم نسخ الرابط!",
      "Comments panel opening... (coming soon)": "جاري فتح لوحة التعليقات... (قريباً)",
      "No reels found yet. Upload one!": "لا توجد ريلز بعد. ارفع واحداً!",

      "Click to select a video": "انقر لاختيار فيديو",
      "MP4, WebM up to 50MB": "MP4، WebM حتى 50 ميغا",
      "Caption": "وصف",
      "Write a catchy caption...": "اكتب وصفاً جذاباً...",
      "Post Reel": "نشر الريل",
      "Uploading...": "جاري الرفع...",

      "Waiting for the other person to join...": "في انتظار انضمام الشخص الآخر...",

      "Discover the things you love.": "اكتشف الأشياء التي تحبها.",
      "Connect with friends, share your universe, and explore what's happening around the world right now.": "تواصل مع الأصدقاء، شارك عالمك، واستكشف ما يحدث حول العالم الآن.",
      "Create a Page": "إنشاء صفحة",
      "for a celebrity, brand or business.": "لمشهور أو علامة تجارية أو عمل تجاري.",

      "Systems Online": "الأنظمة متصلة",

      "liked your post.": "أعجب بمنشورك.",
      "commented on your post.": "علّق على منشورك.",
      "started following you.": "بدأ بمتابعتك.",
      "sent you a message.": "أرسل لك رسالة.",
      "liked your reel.": "أعجب بالريل الخاص بك.",
      "Someone": "شخص ما",
      "New notification": "إشعار جديد",

      "Building awesome things! 🚀": "بناء أشياء رائعة! 🚀"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "English",
    fallbackLng: "English",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
