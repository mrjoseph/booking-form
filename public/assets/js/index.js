(function($, window, undefined){
    var bookingForm = bookingForm || {};
    bookingForm = {
        myForm      : $('#myform'),
        submitBtn   : $('#submit'),
        resetBtn    : $('#reset'),
        firstname   : $('#firstname'),
        lastname    : $('#lastname'),
        email       : $('#email'),
        datepicker  : $('#datepicker'),
        NoOfPeople  : $('#NoOfPeople'),
        phoneNumber : $('#phoneNumber'),
        statusChange: $('.checked'),
        formVailid  : false,

        getData :function(formArray){
            var
            i,
            obj = {},
            len = formArray.length,
            item;
            for(i=0; i<len; i++){
                item = formArray[i];
                obj[item.name] = item.value;
            }
            return obj;
        },
        //RegEx checks the input value
        IsEmail : function(email){
            //console.log(email);
            var regex = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
            return regex.test(email);
        },
        checkForm : function(){
            if(bookingForm.firstname.val() !== '' &&
                bookingForm.lastname.val() !== '' &&
                bookingForm.email.val() !== '' &&
                bookingForm.datepicker.val() !== '' &&
                bookingForm.NoOfPeople.val() !== '' &&
                bookingForm.phoneNumber.val() !== ''){
                    $('#myform input').removeClass('required');
                    if(!bookingForm.IsEmail(bookingForm.email.val())){
                        $('#email').addClass('required');
                        return false;
                    } else {
                        bookingForm.formVailid = true;
                    }

            } else {
                bookingForm.formVailid = false;
                $('.msg').show();
                $('.msg').removeClass('alert alert-success');
                $('.msg').addClass('alert alert-error').html('Please fill in the fields marked in red.');
                console.log($('#datepicker').val());
                var i, input = bookingForm.myForm.find('*').length, result = '';
                for(i=0;i<input;i++){
                    if ($('#myform input:nth-child('+i+')').val() === ''){
                        $('#myform input:nth-child('+i+')').addClass('required');

                    } else if ($('#myform input:nth-child('+i+')').val() !== ''){
                        $('#myform input:nth-child('+i+')').removeClass('required');
                    }
                }
            }
        },

        submitBookings : function(myNewObject){
            //Because of scope issues within the namespace I've seperated the Jquery
            //ajax function, options and callback
            callBack = function(html){
                var result = html.firstname + ' ' + html.lastname + ' Has been successfully added to table bookings.';
                $('.msg').show();
                $('.msg').removeClass('alert alert-error');
                $('.msg').addClass('alert alert-success').html(result);

                //Clear form aftere 5 seconds
                setTimeout(function(){
                    bookingForm.clearForm();
                    $('.msg').fadeOut(function(){
                        $('.msg').empty().removeClass('alert alert-success');
                    });
                },5000);
            };
            var options = {
                url     : '/save',
                type    : 'post',
                dataType: 'json',
                cache   : false,
                data    : myNewObject
            };
            options.success = callBack(myNewObject);

            $.ajax(options);
        },

        getBookings : function(){
            $.ajax({
                url     : '/display',
                type    : 'get',
                dataType: 'json',
                cache: false,
                success : function(response){
                    var i = 0, key, result = '';
                    for(key in response.customers){
                      i = i+1;
                      var seated = response.customers[i].checked;
                      //var customerNumber = response.customers.key;

                    result += '<div class="userInfo seated-'+ seated +'"><ul>';
                    result += '<li><strong>Booking for:</strong> ' +response.customers[i].firstname + ' '  +response.customers[i].lastname +'</li>';
                    result += '<li><strong>email:</strong> <a href="mailto:'+response.customers[i].email+'">' +response.customers[i].email + '</a></li>';
                    result += '<li><strong>Attendees:</strong> ' +response.customers[i].NoOfPeople + '</li>';
                    result += '<li><strong>Tel:</strong> ' +response.customers[i].phoneNumber + '</li>';
                    result += '<li><select name="checked" class="checked" data-customerNumber="'+key+'">';
                    if(response.customers[i].checked ==='false' ){
                        result += '<option value="false">Not arrived</option>';
                        result += '<option value="true">Seated</option>';
                    } else {
                        result += '<option value="true">Seated</option>';
                        result += '<option value="false">Not arrived</option>';
                    }
                    result += '</select></li>';
                    result += '</ul></div>';
                    }
                    $('#users').html(result);
                }
            });
        },

        clearForm : function(){
             bookingForm.myForm.find('input[type="text"],input[type="password"]').val('');
        },
        editBooking: function(checkinStatus){
            console.log('somthing has happened');
            callBack = function(html){
                console.log('success');
                setTimeout(function(){
                    bookingForm.getBookings();
                },100);

           };
           var options = {
               url     : '/edit',
               type    : 'post',
               dataType: 'json',
               cache   : false,
               data    : checkinStatus
           };
           options.success = callBack(checkinStatus);

           $.ajax(options);
        },

        init : function(){
            bookingForm.getBookings();
            //Submit Button
            bookingForm.submitBtn.on('click' ,function(e){
                e.preventDefault();
                bookingForm.checkForm();
                if (bookingForm.formVailid){
                   var data     = bookingForm.myForm.serializeArray(),
                    myNewObject = bookingForm.getData(data);
                    bookingForm.submitBookings(myNewObject);
                } else {
                    console.log('fields required');
                }
            });

            //reset form button
            bookingForm.resetBtn.on('click' ,function(e){
                e.preventDefault();
                bookingForm.clearForm();
            });

            //Change status
            $('.checked').live('change',function(){
                var checkinStatus = {};
                checkinStatus.customerNo = $(this).attr('data-customerNumber');
                checkinStatus.status = $(this).val();
                console.log(checkinStatus);
                bookingForm.editBooking(checkinStatus);
            });
        }
    };

    $(document).ready(function(){
        bookingForm.init();
    });
}(jQuery,window));
