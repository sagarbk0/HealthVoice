function signIn() {
	var google = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(google);
}

function signOut() {
	firebase.auth().signOut();
}

function initAuth() {
	firebase.auth().onAuthStateChanged(authStateObserver);
}

function userName() {
  return firebase.auth().currentUser.displayName;
}

function updateChat() {
	var query = firebase.firestore().collection('chats').orderBy('timestamp', 'desc').limit(20);
	query.onSnapshot(function(snapshot) {
		snapshot.docChanges().forEach(function(change) {
		  if (change.type === 'removed') {
			deleteMessage(change.doc.id);
		  } else {
			var message = change.doc.data();
			displayMessage(change.doc.id, message.timestamp, message.name,
						   message.text, message.profilePicUrl, message.imageUrl);
		  }
		});
	  });
}

function newChat() {
	return firebase.firestore().collection('chats').add({
		name: userName(),
		text: messageText,
		timestamp: firebase.firestore.FieldValue.serverTimestamp()
	  }).catch(function(error) {
		console.error('Error writing new message to database', error);
	  });
}
