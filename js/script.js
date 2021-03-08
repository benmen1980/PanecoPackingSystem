jQuery(document).ready(function(){

	jQuery(".logout").click(function(){
		jQuery(".user-nav").hide();
		jQuery(".user_login_area").show();
		jQuery(".form-response").html('');
	});

	jQuery(".qtybox-btn").click(function(){
		var qty = jQuery(this).parents(".number-input").find('.quantity').val();
		jQuery(this).parents(".item_row").find(".totalqty").text(qty);
	});

	jQuery(".item_row").click(function(){
		jQuery(this).toggleClass('active');
		jQuery(this).siblings().removeClass('active');
	});

	jQuery('.scanbasket').on('focus', function(){
		jQuery('.item-table-wrapper').show();
	});

	jQuery('.scanbasket').on('focusout', function(){
		//jQuery('.item-table-wrapper').hide();

		var basket_num = jQuery(this).val();

		jQuery.ajax({
			
			url: 'api.php',
			type: 'POST',
			data: {
				'action': 'fetchbasket',
				'basket_number' : basket_num
			},
			success: function(resp){
				
				obj = jQuery.parseJSON(resp);

				if(obj.status == 1) {
					jQuery('.table-items').html(obj.content);
					jQuery('.table-items').show();
					jQuery('.alert').hide();
				} else {
					jQuery('.alert').html('No data found!');
					jQuery('.alert').show();
					jQuery('.table-items').hide();
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
            	console.log(jqXHR.status);
       		}
   		
		});
		

		/*var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener("readystatechange", function() {
		  if(this.readyState === 4) {
		    console.log(this.responseText);
		  }
		});

		xhr.open("GET", "https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES?$filter=ROYY_TRANSPORTMEAN%20eq%20%20'123456'%20&$expand=AINVOICEITEMS_SUBFORM($select=KLINE,PARTNAME,PDES,TQUANT,PRICE)&$select=IVNUM,CDES,IVDATE,DEBIT,IVTYPE,ROYY_TRANSPORTMEAN");
		xhr.setRequestHeader("Authorization", "Basic " + btoa("API:12345678"));
		xhr.setRequestHeader("X-App-Id", "APP006");
		xhr.setRequestHeader("X-App-Key", "F40FFA79343C446A9931BA1177716F04");
		xhr.send();*/
		
	});

	jQuery('.scanitem').on('focus', function(){
		var item_val = jQuery(this).val();
		item_val = item_val.toUpperCase();
		
		jQuery('.item-table-wrapper .item_row').each(function(){
			var td_val = jQuery(this).find('.itemsku').text();

			if(td_val == item_val) {
				var current_qty = parseInt(jQuery(this).find('.quantity').val());
				var new_qty = current_qty + 1;

				jQuery(this).addClass('active');
				jQuery(this).siblings().removeClass('active');
				jQuery(this).find('.quantity').val(new_qty);
				jQuery(this).find('.totalqty').text(new_qty);

			}
		});

		jQuery('.item-table-wrapper').show();
	});

	jQuery('.scanitem').on('focusout', function(){
		jQuery('.item-table-wrapper').hide();
	});

	jQuery(".btn-complete").click(function(){
		jQuery('.item-table-wrapper').hide();
	});

	jQuery(".login_submit").click(function(e){
		e.preventDefault();
		var username = jQuery(".loginform .username").val();
		var password = jQuery(".loginform .password").val();
		var error = 0;

		if(username == '') {
			error = 1;
			jQuery(".loginform .username").addClass('input-error');
		} else {
			jQuery(".loginform .username").removeClass('input-error');
		}

		if(password == '') {
			error = 1;
			jQuery(".loginform .password").addClass('input-error');
		} else {
			jQuery(".loginform .password").removeClass('input-error');
		}

		if(error == 1) {
			jQuery('.form-response').html(
				'<div class="alert alert-danger" role="alert">Please fill out the required fields.</div>'
				);
			return false;

		} else {
			jQuery(".user_login_area").hide();
			jQuery(".logged_user a").text(username);
			jQuery(".user-nav").show();
			jQuery(".loginform")[0].reset();
		}

	});
	

	jQuery.ajax({
		
		url: 'api.php',
		type: 'POST',
		data: {
			'action': 'fetchpallet',
		},
		success: function(resp){
			
			obj = jQuery.parseJSON(resp);

			if(obj.status == 1) {
				jQuery(".pallet_no").html(obj.content);
			} 
		},
		error: function(jqXHR, textStatus, errorThrown) {
        	console.log(jqXHR.status);
   		}
		
	});	

});