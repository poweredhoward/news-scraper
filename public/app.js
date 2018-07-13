var art_id = "";

$(document).on("click", ".note", function(){
    console.log( $(this).attr("data-id") )
    art_id = $(this).attr("data-id");
    $("#add-note-modal").modal('show');
});

$(document).on("click", ".viewNotes", function(){
    $("#note-list").empty();
    console.log( $(this).attr("data-id") )
    art_id = $(this).attr("data-id");
    $("#view-notes-modal").modal('show');
    $.get("/note/" + art_id).then( notes =>{
        art_id = "";
        console.log(notes);
        var notesList = $("<ul class='list-group'>");
        $("#note-list").append(notesList);
        for(var i = 0 ; i < notes.notes.length ; i++){
            var entry = $("<li class = 'list-group-item'>")
            entry.text(notes.notes[i].content);
            notesList.append(entry)
        }
    })
});


$("#addNote").click(function(){
    console.log( $("#noteBody").val());
    var note = {
        content: $("#noteBody").val(), 
        article_id: art_id
    }
    $.post("/note", note).then(function(res){
            art_id = "";
            $("#add-note-modal").modal('hide');
            console.log(res);
        })
})


$("#scrapenew").click(function(){
    $.get("/scrape").then(response => {
        console.log(response);
        window.location.reload()
    })
        
})

