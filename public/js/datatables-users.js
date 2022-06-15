$(document).ready(function () {
  

  $.ajax({
    url: '/api/audit/reports/' + domain,
    type: 'GET',
    success: function (data) {
      var table = $('#datatable-json').DataTable({
        data: data,
        columns: [
          { "data": "SAMAccountName" },
          { "data": "DisplayName" },
          { "data": "whenchanged",
          "render": function (date) { 
            let NewDate = new Date(parseInt(date.substr(6)));

            return NewDate.toLocaleTimeString(navigator.language, {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute:'2-digit',
              second: '2-digit'
            });                    
          }
          
          },
          { "data": "whencreated",
          "render": function (date) { 
            let NewDate = new Date(parseInt(date.substr(6)));

            return NewDate.toLocaleTimeString(navigator.language, {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute:'2-digit',
              second: '2-digit'
            });                    
          }
          
          },
          { "data": "Enabled" },
          {"data": "ObjectGUID",
          "render": function (data) { 
              return '<a href="/dashboard/audit/reports/users/'+data+ '"class="effect-1">View History</a>'                           
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
          { "width": "15%", "targets": 5 },
          { "width": "15%", "targets": 4 },
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
