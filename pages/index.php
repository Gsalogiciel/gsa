// Fonction centrale pour les appels AJAX
function performAjaxRequest(url, method, data, beforeSendCallback, successCallback, completeCallback) {
    $.ajax({
        url: url,
        method: method,
        data: data,
        beforeSend: function () {
            if (typeof beforeSendCallback === 'function') {
                beforeSendCallback();
            }
        },
        success: function (response) {
            if (typeof successCallback === 'function') {
                successCallback(response);
            }
        },
        complete: function () {
            if (typeof completeCallback === 'function') {
                completeCallback();
            }
        },
        error: function (xhr, status, error) {
            console.error(`Erreur lors de la requête AJAX : ${status} - ${error}`);
        }
    });
}

// Initialisation des plugins et des événements
$(document).ready(function () {
    // Initialisation de Select2
    $('.js-example-basic-single1').select2();

    // Initialisation de Flatpickr
    flatpickr("#myID", {
        mode: "range",
        minDate: "year",
        dateFormat: "Y-m-d",
        disable: [
            function (date) {
                return !(date.getDate() % 100);
            }
        ]
    });

    // Gestion de la recherche
    $("#search").keyup(function () {
        const search = $(this).val();
        const sec = localStorage.getItem("Section");
        const mac = localStorage.getItem("mac");

        performAjaxRequest(
            "srch.php",
            "POST",
            { search, sec, mac },
            function () {
                $(".load_sab").css("display", "flex");
            },
            function (response) {
                $("#msd").html(response);
            },
            function () {
                $(".load_sab").css("display", "none");
            }
        );
    });

    // Filtrage par vendeur
    $("#singl1").change(function () {
        const part = $(this).val();
        const sec = localStorage.getItem("Section");
        const mac = localStorage.getItem("mac");

        performAjaxRequest(
            "part.php",
            "POST",
            { part, sec, mac },
            function () {
                $(".load_sab").css("display", "flex");
            },
            function (response) {
                $("#msd").html(response);
            },
            function () {
                $(".load_sab").css("display", "none");
            }
        );
    });

    // Filtrage par date
    $("#myID").change(function () {
        const part = $(this).val();
        const sec = localStorage.getItem("Section");
        const mac = localStorage.getItem("mac");

        performAjaxRequest(
            "time.php",
            "POST",
            { part, sec, mac },
            function () {
                $(".load_sab").css("display", "flex");
            },
            function (response) {
                $("#msd").html(response);
            },
            function () {
                $(".load_sab").css("display", "none");
            }
        );
    });

    // Gestion des statuts
    $(".sta").click(function () {
        $(".sta").removeClass('btn_filter_status_active');
        $(this).addClass('btn_filter_status_active');

        const part = $(this).val();
        const sec = localStorage.getItem("Section");
        const mac = localStorage.getItem("mac");

        performAjaxRequest(
            "stat.php",
            "POST",
            { part, sec, mac },
            function () {
                $(".load_sab").css("display", "flex");
            },
            function (response) {
                $("#msd").html(response);
            },
            function () {
                $(".load_sab").css("display", "none");
            }
        );
    });

    // Suppression d'une commande
    $(".a2").click(function () {
        const id = $(this).data("id");
        const uniq = $(this).data("uniq");

        performAjaxRequest(
            "delete.php",
            "POST",
            { id, uniq },
            null,
            function () {
                location.reload();
            },
            null
        );
    });

    // Affichage des détails d'une commande
    $(".a0").click(function () {
        const eye = $(this).data("id");

        $(".Bonclient").each(function () {
            const bon = $(this).data("id");
            if (bon === eye) {
                $(this).toggleClass("voirbon");
            } else {
                $(this).removeClass("voirbon");
            }
        });
    });

    // Téléchargement d'un bon
    $(".excel").click(function () {
        const bon = $(this).val();

        performAjaxRequest(
            "excel.php",
            "POST",
            { bon },
            null,
            function (data) {
                const text = data.replace('des0,ref0,marque0,qtyB,prixB,userD,nameD,det,pay,nopay,vers', 
                    'Désignation,Référence,Marque,Quantité,Prix_Vente,vendeur,client,datetime,payé,nopayé,versement');
                const blob = new Blob([text], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');

                const now = new Date();
                const formattedDateTime = now.toLocaleString();
                a.download = `Bon_${formattedDateTime}.csv`;
                a.href = url;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            },
            null
        );
    });

    // Acceptation d'une commande
    $(".Accepter").click(function () {
        const Accepter = $(this).val();
        const id = $(this).data("id");

        performAjaxRequest(
            "accepte.php",
            "POST",
            { Accepter, id },
            null,
            function () {
                location.reload();
            },
            null
        );
    });

    // Refus d'une commande
    $(".Refusé").click(function () {
        const Refusé = $(this).val();
        const id = $(this).data("id");

        performAjaxRequest(
            "accepte.php",
            "POST",
            { Accepter: Refusé, id },
            null,
            function () {
                location.reload();
            },
            null
        );
    });
});
