document.addEventListener('DOMContentLoaded', function () {
    var modeSwitch = document.querySelector('.mode-switch');
  
    modeSwitch.addEventListener('click', function () {                     document.documentElement.classList.toggle('dark');
      modeSwitch.classList.toggle('active');
    });
    
    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');
    
    listView.addEventListener('click', function () {
      gridView.classList.remove('active');
      listView.classList.add('active');
      projectsList.classList.remove('jsGridView');
      projectsList.classList.add('jsListView');
    });
    
    gridView.addEventListener('click', function () {
      gridView.classList.add('active');
      listView.classList.remove('active');
      projectsList.classList.remove('jsListView');
      projectsList.classList.add('jsGridView');
    });
    
    document.querySelector('.messages-btn').addEventListener('click', function () {
      document.querySelector('.messages-section').classList.add('show');
    });
    
    document.querySelector('.messages-close').addEventListener('click', function() {
      document.querySelector('.messages-section').classList.remove('show');
    });
  });

function get_apikey(){
  var url = "/dashboard/generate/api/key"
  var res_ = document.querySelector('.result');

  fetch(url)
  .then(response=>response.json())
  .then(data=>{ 
  res_.innerHTML = data;
  
  })



}

function CopyPaste() {


  var res_ = document.querySelector('.result');


  function updateClipboard(res_) {
    navigator.clipboard.writeText(newClip).then(function() {
      /* le presse-papier est correctement paramétré */
    }, function() {
      /* l'écriture dans le presse-papier a échoué */
    });
  }




  
} 
