document.addEventListener("DOMContentLoaded", function(){
	
	if(window.location.hash) {
		let hash = window.location.hash.substring(1);
		
		if (hash == 'clear') {
			localStorage.removeItem('User ID');
		}
		
		if (hash.includes("-")) {
			hash = hash.split("-");
			
			if (hash.length == 2) {
				setLocalStorage('Key', hash[0]);
				setLocalStorage('User ID', hash[1]);
			}
		}
	}
	
	getStarted();
	getComments();
});

function getComments() {
	let query = ' query { boards(ids:' + id_radiatorBoard + ') { updates (limit: 1) { body id created_at creator { name } item_id } } } ';
	
	mondayAPI(query, function(data) {
		let updates = new Updates(data);
		
		var html = '';
		
		if (updates.all.length == 0) {
			html += 'No comments.';
		} else {
			let update = updates.all[0];
			
			let lastCheckedDateTime = new Date(getLocalStorage('Last Visited Comments'));
			let lastCommentDateTime = new Date(update.created);
			
			if (lastCommentDateTime > lastCheckedDateTime) {
				html += 'Un-read comments (' + humanized_time_span(update.created) + ')';
			} else {
				html += 'No new comments';
			}
		}
		
		gbc('#last-comment').html(html);
	});
}