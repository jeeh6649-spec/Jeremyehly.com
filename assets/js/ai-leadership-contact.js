document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('engagementForm');
  if (!form) { return; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = data.get('name') || '';
    var email = data.get('email') || '';
    var organization = data.get('organization') || '';
    var engagement = data.get('engagement') || '';
    var message = data.get('message') || '';

    var subject = encodeURIComponent(engagement + ' inquiry from ' + name);
    var body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Organization: ' + organization + '\n' +
      'Engagement: ' + engagement + '\n\n' +
      'Message:\n' + message
    );

    window.location.href = 'mailto:ehlyjg@gmail.com?subject=' + subject + '&body=' + body;
  });
});
