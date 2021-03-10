jQuery(document).ready(function(){

	jQuery(".logout").click(function(){
		jQuery(".user-nav").hide();
		jQuery(".user_login_area").show();
		jQuery(".form-response").html('');
	});

	jQuery('body').on('click','.qtybox-btn',function(){
		var qty = jQuery(this).parents(".number-input").find('.quantity').val();
		var new_qty = 0;

		if(jQuery(this).hasClass('plus')){
			new_qty = parseInt(qty) + 1;
		} else {
			new_qty = parseInt(qty) - 1;
			if(new_qty < 0) {
				new_qty = 0;
			}
		}	

		jQuery(this).parents(".number-input").find('.quantity').val(new_qty);
		jQuery(this).parents(".item_row").find(".totalqty").text(new_qty); 
	});

	jQuery('.table-items').on('click','.item_row',function(){
		jQuery(this).toggleClass('active');
		jQuery(this).siblings().removeClass('active'); 
	});
	

	jQuery.ajax({
		
		url: 'api.php',
		type: 'POST',
		data: {
			'action': 'fetchpallet',
		},
		success: function(resp){
			
			var obj = jQuery.parseJSON(resp);

			if(obj.status == 1) {
				jQuery(".pallet_no").html(obj.content);
			} 
		},
		error: function(jqXHR, textStatus, errorThrown) {
        	console.log(jqXHR.status);
   		}
		
	});

	jQuery('.scanbasket').on('focusout', function(){

		var basket_num = jQuery(this).val();
		
		if(basket_num) {

			jQuery(".scanitem").parents('.form-group').show();

			jQuery.ajax({
				
				url: 'api.php',
				type: 'POST',
				data: {
					'action': 'fetchbasket',
					'basket_number' : basket_num
				},
				success: function(resp){
					
					var obj = jQuery.parseJSON(resp);

					if(obj.status == 1) {
						jQuery('.table-items').html(obj.content);
						jQuery('.item-table-wrapper').addClass('show-table');
						jQuery('.alert').hide();
					} else {
						jQuery('.alert').html('No data found!');
						jQuery('.alert').show();
						jQuery('.item-table-wrapper').removeClass('show-table');
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
	            	console.log(jqXHR.status);
	       		}
	   		
			});

		} 
		
	});

	jQuery('.scanitem').on('focusout', function(){

		var items = [];
		var item_val = jQuery(this).val();

		//item_val = item_val.toUpperCase();
		
		jQuery('.table-items .item_row').each(function(){
			
			var td_val = jQuery(this).find('.itemsku').attr('data-sku');
			items.push(td_val);

			if(jQuery.trim(item_val) == jQuery.trim(td_val)) {

				var current_qty = parseInt(jQuery(this).find('.quantity').val());
				var new_qty = current_qty + 1;

				jQuery(this).addClass('active');
				jQuery(this).siblings().removeClass('active');
				jQuery(this).find('.quantity').val(new_qty);
				jQuery(this).find('.totalqty').text(new_qty);

				jQuery('.item-table-wrapper').addClass('show-table');
				jQuery('.alert').hide();
			} 
		});

		if(jQuery.inArray(item_val, items) === -1){
			jQuery('.item-table-wrapper').removeClass('show-table');
			jQuery('.alert').html('No data found!');
		    jQuery('.alert').show();
		}

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
		

	/*jQuery(".qtybox-btn").click(function(){
		var qty = jQuery(this).parents(".number-input").find('.quantity').val();
		jQuery(this).parents(".item_row").find(".totalqty").text(qty);
	});*/

	/*jQuery(".item_row").click(function(){
		jQuery(this).toggleClass('active');
		jQuery(this).siblings().removeClass('active');
	});*/

	/*jQuery('.scanbasket').on('focus', function(){
		jQuery('.item-table-wrapper').show();
	});*/

	/*jQuery('.scanitem').on('focusout', function(){
		jQuery('.item-table-wrapper').hide();
	});*/


});