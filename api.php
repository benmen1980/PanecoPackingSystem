<?php

if (isset($_POST['action']) && $_POST['action'] != '') {

	foreach ($_POST as $key => $value) {
		if ($key == 'action') {
			$case = $value;
		} else {
			$params = $value;
		}
	}

	$date = date('Y-m-d');

	switch ($case) {
	case 'fetchbasket':fetchBasket($params);
		break;

	case 'fetchpallet':fetchPalletNumber($date);
		break;

	default:'other';
		break;
	}
}

function fetchBasket($number) {

	$response = array();
	$auth = base64_encode("API:12345678");
	$filter = "filter";
	$expand = "expand";
	$select = "select";

	$url = "https://pri.paneco.com/odata/Priority/tabula.ini/a190515/AINVOICES?$" . $filter . "=ROYY_TRANSPORTMEAN eq '" . $number . "' &$" . $expand . "=AINVOICEITEMS_SUBFORM($" . $select . "=KLINE,PARTNAME,PDES,TQUANT,PRICE)&$" . $select . "=IVNUM,CDES,IVDATE,DEBIT,IVTYPE,ROYY_TRANSPORTMEAN";
	$url = str_replace(" ", '%20', $url);
	//$url = urlencode($url);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		"Authorization: Basic $auth",
		"X-App-Id: APP006",
		"X-App-Key: F40FFA79343C446A9931BA1177716F04",
		"Accept: application/json",
		"Content-Type: application/json",
	));
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$error = curl_error($ch);
	$output = curl_exec($ch);
	curl_close($ch);
	$results = json_decode($output);

	if (!empty($results->value)) {

		$counter = 1;
		$html = '<tbody><tr>
	                 <th>נסרק</th>
	                  <th>כמות</th>
	                   <th>תאור</th>
	                    <th>מקט</th>
	              </tr>';

		foreach ($results->value as $data) {
			foreach ($data->AINVOICEITEMS_SUBFORM as $item) {
				$qty = $item->TQUANT;
				$des = $item->PDES;
				$sku = $item->PARTNAME;

				$html .= '<tr class="item_row" data-id="' . $counter . '">';
				$html .= ' <td class="qtybox">
	                            <div class="number-input md-number-input">
	                              <input class="quantity" min="0" name="quantity" value="' . $qty . '" type="number">
	                              <div class="qty-btn">
	                                <button class="plus qtybox-btn"><i class="fa fa-sort-asc" aria-hidden="true"></i></button>
                                    <button class="minus qtybox-btn"><i class="fa fa-caret-down" aria-hidden="true"></i></button>
	                              </div>
	                            </div>
	                        </td>';
				$html .= '<td class="totalqty">' . $qty . '</td>';
				$html .= '<td class="itemdesc">' . $des . '</td>';
				$html .= '<td class="itemsku" data-sku="' . $sku . '">' . $sku . '</td>';
				$html .= '</tr>';

				$counter++;
			}
		}
		$html .= '</tbody>';
		$response['status'] = 1;
		$response['content'] = $html;

	} else {

		$response['status'] = 0;
	}

	echo json_encode($response);
	die;
}

function fetchPalletNumber($date) {

	$response = array();
	$auth = base64_encode("API:12345678");
	$filter = "filter";
	$select = "select";
	$date = urlencode(date(DATE_ATOM, strtotime($date)));

	$url = "https://pri.paneco.com/odata/Priority/tabula.ini/a190515/QAMR_PALLET2?$" . $filter . "=CURDATE ge " . $date . "&$" . $select . "=PALLETNUM,STCODE,STDES";
	$url = str_replace(" ", '%20', $url);
	//echo $url;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		"Authorization: Basic $auth",
		"X-App-Id: APP006",
		"X-App-Key: F40FFA79343C446A9931BA1177716F04",
		"Accept: application/json",
		"Content-Type: application/json",
	));
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$error = curl_error($ch);
	$output = curl_exec($ch);
	curl_close($ch);
	$results = json_decode($output);

	$html = '<option>Pallet No.</option>';

	if (!empty($results->value)) {

		foreach ($results->value as $data) {

			$html .= '<option value="' . $data->PALLETNUM . '">' . $data->PALLETNUM . '</option>';
		}

		$response['status'] = 1;
		$response['content'] = $html;

	} else {
		$response['status'] = 0;
	}

	echo json_encode($response);
	die;
}

?>

