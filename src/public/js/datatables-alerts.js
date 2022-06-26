$(document).ready(function () {
  

  $.ajax({
    url: '/api/alerts/',
    type: 'GET',
    success: function (data) {
      var table = $('#datatable-json').DataTable({
        data: data,
        columns: [
          { "data": "Name" },
          { "data": "To" },
          { "data": "From"},
          { "data": "Type"},
          { "data": "Trigger"},
          { "data": "AlertID",
          "render": function (data) {

            return '<a href="/api/alerts/delete/'+ data +'"><button class="notification-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></a>'             
          
          }
        }
        ],
        responsive: true,
        paging: true,
        ordering: true,
        searching: true,
        dom: 'tpr',
        bFilter: true,
        "columnDefs": [
          { "width": "15%", "targets": 4 },
          { "width": "10%", "targets": 5 },
          { "type":"date", "targets": 3 },
          { "type":"date", "targets": 2 }
        ]
      });
      $('#datatable-json').on('click', 'button', function (e) {
        e.preventDefault;
        var rows = table.row($(this).parents('tr')).data(); //Get Data Of The Selected Row
        console.log(rows)
      });


      var oTable = $('#datatable-json').DataTable();   //using Capital D, which is mandatory to retrieve "api" datatables' object, latest jquery Datatable
      $('#search_input').keyup(function(){
            oTable.search($(this).val()).draw() ;
      })


    }
  });





});
