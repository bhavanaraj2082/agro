<script>
	import { onMount } from "svelte";
	import { toast, Toaster } from "svelte-sonner";
	import { enhance } from "$app/forms";

	import Icon from "@iconify/svelte";
	export let data;
	let isLoadingPhone = false;
	let isEmailVerified = false;
	let loadingotp = false;
	let loadingPhone = false;
	let isLoading = false;
	let showSuccesDiv = false;
	let showFailureDiv = false;
	let ProfileEmailVerified;
	let submitting = false;
	let form;
	let errors = {};
	// console.log(data,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
	let authedUserEmailVerified = data?.profile?.isEmailVerified;
	console.log("authedUserEmailVerified", authedUserEmailVerified);

	// console.log("authedUserEmailVerified",authedUserEmailVerified);

	let verificationMessage = "";
	let emailSent = false;
	let displayMessage = "";
	let enteredOtp = "";
	let enteredOtpemail = "";
	let isOtpVerified = false;
	let isOtpPhoneVerified = false;
	let form3;
	let phone = "";
	let email = "";
	let isDataAvailable = false;
	let isEditable = false;
	let country = "";
	let name = "";
	let message = "";
	let subject = "";
	let formValid = true;
	let formSubmitted = false;
	let showErrors = false;
	let successMessage = "";
	let errorMessage = "";
	function resetForm() {
		phone = "";
		email = "";
		country = "";
		name = "";
		message = "";
		subject = "";
		successMessage = "";
		errorMessage = "";
	}
	onMount(() => {
		if (data && data.profile) {
			name =
				`${data.profile.firstName || ""} ${data.profile.lastName || ""}`.trim();
			email = data.profile.email || "";
			phone = data.profile.cellPhone || data.profile.primaryPhone;

			const profileCountry = data.profile.country?.trim();
			if (profileCountry) {
				const foundCountry = countries.find(
					(c) =>
						c.name.toLowerCase() === profileCountry.toLowerCase(),
				);
				if (foundCountry) {
					country = foundCountry.name;
				}
			}

			isDataAvailable = true;
		} else {
			name = "";
			email = data?.email || "";
			phone = "";

			country = "";
			isDataAvailable = false;

			if (data?.email) {
				email = data.email;
				const reloadFlag = sessionStorage.getItem("emailReloaded");
				if (!reloadFlag) {
					sessionStorage.setItem("emailReloaded", "true");
					location.reload(); // This will reload the page only once to prevent infinite reload
				} else {
					sessionStorage.removeItem("emailReloaded");
				}
			}
		}

		isEditable = false;
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	});
	const countries = [
		{ name: "Afghanistan", code: "+93" },
		{ name: "Albania", code: "+355" },
		{ name: "Algeria", code: "+213" },
		{ name: "Andorra", code: "+376" },
		{ name: "Angola", code: "+244" },
		{ name: "Antigua and Barbuda", code: "+1-268" },
		{ name: "Argentina", code: "+54" },
		{ name: "Armenia", code: "+374" },
		{ name: "Australia", code: "+61" },
		{ name: "Austria", code: "+43" },
		{ name: "Azerbaijan", code: "+994" },
		{ name: "Bahamas", code: "+1-242" },
		{ name: "Bahrain", code: "+973" },
		{ name: "Bangladesh", code: "+880" },
		{ name: "Barbados", code: "+1-246" },
		{ name: "Belarus", code: "+375" },
		{ name: "Belgium", code: "+32" },
		{ name: "Belize", code: "+501" },
		{ name: "Benin", code: "+229" },
		{ name: "Bhutan", code: "+975" },
		{ name: "Bolivia", code: "+591" },
		{ name: "Bosnia and Herzegovina", code: "+387" },
		{ name: "Botswana", code: "+267" },
		{ name: "Brazil", code: "+55" },
		{ name: "Brunei", code: "+673" },
		{ name: "Bulgaria", code: "+359" },
		{ name: "Burkina Faso", code: "+226" },
		{ name: "Burundi", code: "+257" },
		{ name: "Cabo Verde", code: "+238" },
		{ name: "Cambodia", code: "+855" },
		{ name: "Cameroon", code: "+237" },
		{ name: "Canada", code: "+1" },
		{ name: "Central African Republic", code: "+236" },
		{ name: "Chad", code: "+235" },
		{ name: "Chile", code: "+56" },
		{ name: "China", code: "+86" },
		{ name: "Colombia", code: "+57" },
		{ name: "Comoros", code: "+269" },
		{ name: "Congo, Republic of the", code: "+242" },
		{ name: "Congo, Democratic Republic of the", code: "+243" },
		{ name: "Costa Rica", code: "+506" },
		{ name: "Croatia", code: "+385" },
		{ name: "Cuba", code: "+53" },
		{ name: "Cyprus", code: "+357" },
		{ name: "Czech Republic", code: "+420" },
		{ name: "Denmark", code: "+45" },
		{ name: "Djibouti", code: "+253" },
		{ name: "Dominica", code: "+1-767" },
		{ name: "Dominican Republic", code: "+1-809" },
		{ name: "Ecuador", code: "+593" },
		{ name: "Egypt", code: "+20" },
		{ name: "El Salvador", code: "+503" },
		{ name: "Equatorial Guinea", code: "+240" },
		{ name: "Eritrea", code: "+291" },
		{ name: "Estonia", code: "+372" },
		{ name: "Eswatini", code: "+268" },
		{ name: "Ethiopia", code: "+251" },
		{ name: "Fiji", code: "+679" },
		{ name: "Finland", code: "+358" },
		{ name: "France", code: "+33" },
		{ name: "Gabon", code: "+241" },
		{ name: "Gambia", code: "+220" },
		{ name: "Georgia", code: "+995" },
		{ name: "Germany", code: "+49" },
		{ name: "Ghana", code: "+233" },
		{ name: "Greece", code: "+30" },
		{ name: "Grenada", code: "+1-473" },
		{ name: "Guatemala", code: "+502" },
		{ name: "Guinea", code: "+224" },
		{ name: "Guinea-Bissau", code: "+245" },
		{ name: "Guyana", code: "+592" },
		{ name: "Haiti", code: "+509" },
		{ name: "Honduras", code: "+504" },
		{ name: "Hungary", code: "+36" },
		{ name: "Iceland", code: "+354" },
		{ name: "India", code: "+91" },
		{ name: "Indonesia", code: "+62" },
		{ name: "Iran", code: "+98" },
		{ name: "Iraq", code: "+964" },
		{ name: "Ireland", code: "+353" },
		{ name: "Israel", code: "+972" },
		{ name: "Italy", code: "+39" },
		{ name: "Jamaica", code: "+1-876" },
		{ name: "Japan", code: "+81" },
		{ name: "Jordan", code: "+962" },
		{ name: "Kazakhstan", code: "+7" },
		{ name: "Kenya", code: "+254" },
		{ name: "Kiribati", code: "+686" },
		{ name: "Kuwait", code: "+965" },
		{ name: "Kyrgyzstan", code: "+996" },
		{ name: "Laos", code: "+856" },
		{ name: "Latvia", code: "+371" },
		{ name: "Lebanon", code: "+961" },
		{ name: "Lesotho", code: "+266" },
		{ name: "Liberia", code: "+231" },
		{ name: "Libya", code: "+218" },
		{ name: "Liechtenstein", code: "+423" },
		{ name: "Lithuania", code: "+370" },
		{ name: "Luxembourg", code: "+352" },
		{ name: "Madagascar", code: "+261" },
		{ name: "Malawi", code: "+265" },
		{ name: "Malaysia", code: "+60" },
		{ name: "Maldives", code: "+960" },
		{ name: "Mali", code: "+223" },
		{ name: "Malta", code: "+356" },
		{ name: "Marshall Islands", code: "+692" },
		{ name: "Mauritania", code: "+222" },
		{ name: "Mauritius", code: "+230" },
		{ name: "Mexico", code: "+52" },
		{ name: "Micronesia", code: "+691" },
		{ name: "Moldova", code: "+373" },
		{ name: "Monaco", code: "+377" },
		{ name: "Mongolia", code: "+976" },
		{ name: "Montenegro", code: "+382" },
		{ name: "Morocco", code: "+212" },
		{ name: "Mozambique", code: "+258" },
		{ name: "Myanmar", code: "+95" },
		{ name: "Namibia", code: "+264" },
		{ name: "Nauru", code: "+674" },
		{ name: "Nepal", code: "+977" },
		{ name: "Netherlands", code: "+31" },
		{ name: "New Zealand", code: "+64" },
		{ name: "Nicaragua", code: "+505" },
		{ name: "Niger", code: "+227" },
		{ name: "Nigeria", code: "+234" },
		{ name: "North Macedonia", code: "+389" },
		{ name: "Norway", code: "+47" },
		{ name: "Oman", code: "+968" },
		{ name: "Pakistan", code: "+92" },
		{ name: "Palau", code: "+680" },
		{ name: "Palestine", code: "+970" },
		{ name: "Panama", code: "+507" },
		{ name: "Papua New Guinea", code: "+675" },
		{ name: "Paraguay", code: "+595" },
		{ name: "Peru", code: "+51" },
		{ name: "Philippines", code: "+63" },
		{ name: "Poland", code: "+48" },
		{ name: "Portugal", code: "+351" },
		{ name: "Qatar", code: "+974" },
		{ name: "Romania", code: "+40" },
		{ name: "Russia", code: "+7" },
		{ name: "Rwanda", code: "+250" },
		{ name: "Saint Kitts and Nevis", code: "+1-869" },
		{ name: "Saint Lucia", code: "+1-758" },
		{ name: "Saint Vincent and the Grenadines", code: "+1-784" },
		{ name: "Samoa", code: "+685" },
		{ name: "San Marino", code: "+378" },
		{ name: "Sao Tome and Principe", code: "+239" },
		{ name: "Saudi Arabia", code: "+966" },
		{ name: "Senegal", code: "+221" },
		{ name: "Serbia", code: "+381" },
		{ name: "Seychelles", code: "+248" },
		{ name: "Sierra Leone", code: "+232" },
		{ name: "Singapore", code: "+65" },
		{ name: "Slovakia", code: "+421" },
		{ name: "Slovenia", code: "+386" },
		{ name: "Solomon Islands", code: "+677" },
		{ name: "Somalia", code: "+252" },
		{ name: "South Africa", code: "+27" },
		{ name: "South Korea", code: "+82" },
		{ name: "Spain", code: "+34" },
		{ name: "Sri Lanka", code: "+94" },
		{ name: "Sudan", code: "+249" },
		{ name: "Suriname", code: "+597" },
		{ name: "Sweden", code: "+46" },
		{ name: "Switzerland", code: "+41" },
		{ name: "Syria", code: "+963" },
		{ name: "Taiwan", code: "+886" },
		{ name: "Tajikistan", code: "+992" },
		{ name: "Tanzania", code: "+255" },
		{ name: "Thailand", code: "+66" },
		{ name: "Togo", code: "+228" },
		{ name: "Tonga", code: "+676" },
		{ name: "Trinidad and Tobago", code: "+1-868" },
		{ name: "Tunisia", code: "+216" },
		{ name: "Turkey", code: "+90" },
		{ name: "Turkmenistan", code: "+993" },
		{ name: "Tuvalu", code: "+688" },
		{ name: "Uganda", code: "+256" },
		{ name: "Ukraine", code: "+380" },
		{ name: "United Arab Emirates", code: "+971" },
		{ name: "United Kingdom", code: "+44" },
		{ name: "United States", code: "+1" },
		{ name: "Uruguay", code: "+598" },
		{ name: "Uzbekistan", code: "+998" },
		{ name: "Vanuatu", code: "+678" },
		{ name: "Vatican City", code: "+39" },
		{ name: "Venezuela", code: "+58" },
		{ name: "Vietnam", code: "+84" },
		{ name: "Yemen", code: "+967" },
		{ name: "Zambia", code: "+260" },
		{ name: "Zimbabwe", code: "+263" },
	];
	const phoneNumberPatterns = {
		Afghanistan: /^[7-9]\d{8}$/,
		Algeria: /^[5-9]\d{8}$/,
		Andorra: /^\+376[0-9]{6}$/,
		Angola: /^(\+244|0)9\d{8}$/,
		"Antigua and Barbuda": /^\+1[2689]\d{7}$/,
		Armenia: /^(\+374|0)(10|20|30|40|50|60|70|80)\d{6}$/,
		Austria: /^\+43\d{1,12}$/,
		Azerbaijan: /^(\+994|0)5[0-9]\d{7}$/,
		Bahamas: /^\+1[242]\d{7}$/,
		Bangladesh: /^(\+8801|01)\d{9}$/,
		Belarus: /^(\+375|0)29\d{7}$/,
		Belgium: /^(\+32|0)4\d{8}$/,
		Belize: /^(\+501|0)\d{7}$/,
		Benin: /^(\+229|0)\d{8}$/,
		Bolivia: /^(\+591|0)\d{8}$/,
		"Bosnia and Herzegovina": /^(\+387|0)\d{8}$/,
		"Burkina Faso": /^(\+226|0)\d{8}$/,
		Burundi: /^(\+257|0)\d{8}$/,
		"Cabo Verde": /^(\+238|0)\d{7}$/,
		Cambodia: /^(\+855|0)\d{8,9}$/,
		Cameroon: /^(\+237|0)\d{8}$/,
		"Central African Republic": /^(\+236|0)\d{8}$/,
		Chad: /^(\+235|0)\d{8}$/,
		Comoros: /^(\+269|0)\d{7}$/,
		"Congo, Republic of the": /^(\+242|0)\d{7}$/,
		"Congo, Democratic Republic of the": /^(\+243|0)\d{9}$/,
		"Costa Rica": /^(\+506|0)\d{8}$/,
		Croatia: /^(\+385|0)9\d{8}$/,
		Cyprus: /^(\+357|0)\d{8}$/,
		"Czech Republic": /^(\+420|0)\d{9}$/,
		Djibouti: /^(\+253|0)\d{7}$/,
		Dominica: /^(\+1[7678]|0)\d{7}$/,
		"Dominican Republic": /^(\+1[809]|0)\d{7}$/,
		Ecuador: /^(\+593|0)\d{9}$/,
		"El Salvador": /^(\+503|0)\d{8}$/,
		"Equatorial Guinea": /^(\+240|0)\d{8}$/,
		Eritrea: /^(\+291|0)\d{7}$/,
		Estonia: /^(\+372|0)\d{7}$/,
		Eswatini: /^(\+268|0)\d{8}$/,
		Finland: /^(\+358|0)\d{9}$/,
		France: /^(\+33|0)\d{9}$/,
		Gabon: /^(\+241|0)\d{7}$/,
		Gambia: /^(\+220|0)\d{7}$/,
		Georgia: /^(\+995|0)\d{9}$/,
		Germany: /^(\+49|0)\d{10}$/,
		Greece: /^(\+30|0)\d{10}$/,
		Grenada: /^(\+1[473]|0)\d{7}$/,
		Guatemala: /^(\+502|0)\d{8}$/,
		Guinea: /^(\+224|0)\d{9}$/,
		"Guinea-Bissau": /^(\+245|0)\d{7}$/,
		Guyana: /^(\+592|0)\d{7}$/,
		Honduras: /^(\+504|0)\d{8}$/,
		Iran: /^(\+98|0)\d{10}$/,
		Iraq: /^(\+964|0)\d{9}$/,
		Ireland: /^(\+353|0)\d{9}$/,
		Italy: /^(\+39|0)\d{10}$/,
		Jamaica: /^(\+1[876]|0)\d{7}$/,
		Kenya: /^(\+254|0)\d{9}$/,
		Kiribati: /^(\+686|0)\d{4}$/,
		Laos: /^(\+856|0)\d{8}$/,
		Latvia: /^(\+371|0)\d{8}$/,
		Lebanon: /^(\+961|0)\d{8}$/,
		Lesotho: /^(\+266|0)\d{8}$/,
		Liechtenstein: /^(\+423|0)\d{7}$/,
		Lithuania: /^(\+370|0)\d{8}$/,
		Luxembourg: /^(\+352|0)\d{6}$/,
		Malawi: /^(\+265|0)\d{9}$/,
		Maldives: /^(\+960|0)\d{7}$/,
		Mali: /^(\+223|0)\d{8}$/,
		Malta: /^(\+356|0)\d{8}$/,
		"Marshall Islands": /^(\+692|0)\d{7}$/,
		Mauritania: /^(\+222|0)\d{8}$/,
		Micronesia: /^(\+691|0)\d{7}$/,
		Monaco: /^(\+377|0)\d{8}$/,
		Mongolia: /^(\+976|0)\d{8}$/,
		Montenegro: /^(\+382|0)\d{8}$/,
		Mozambique: /^(\+258|0)\d{9}$/,
		Myanmar: /^(\+95|0)\d{9}$/,
		Nauru: /^(\+674|0)\d{4}$/,
		Netherlands: /^(\+31|0)\d{9}$/,
		"New Zealand": /^(\+64|0)\d{9}$/,
		Niger: /^(\+227|0)\d{8}$/,
		Nigeria: /^(\+234|0)\d{10}$/,
		"North Macedonia": /^(\+389|0)\d{9}$/,
		Oman: /^(\+968|0)\d{8}$/,
		Palau: /^(\+680|0)\d{7}$/,
		Palestine: /^(\+970|0)\d{9}$/,
		Panama: /^(\+507|0)\d{7}$/,
		"Papua New Guinea": /^(\+675|0)\d{7}$/,
		Paraguay: /^(\+595|0)\d{9}$/,
		Poland: /^(\+48|0)\d{9}$/,
		Portugal: /^(\+351|0)\d{9}$/,
		Romania: /^(\+40|0)\d{9}$/,
		"Saint Kitts and Nevis": /^(\+1[869]|0)\d{7}$/,
		"Saint Lucia": /^(\+1[758]|0)\d{7}$/,
		"Saint Vincent and the Grenadines": /^(\+1[784]|0)\d{7}$/,
		Samoa: /^(\+685|0)\d{5}$/,
		"San Marino": /^(\+378|0)\d{7}$/,
		"Sao Tome and Principe": /^(\+239|0)\d{7}$/,
		"Saudi Arabia": /^(\+966|0)\d{9}$/,
		Senegal: /^(\+221|0)\d{9}$/,
		Seychelles: /^(\+248|0)\d{7}$/,
		"Sierra Leone": /^(\+232|0)\d{8}$/,
		Slovakia: /^(\+421|0)\d{9}$/,
		Slovenia: /^(\+386|0)\d{8}$/,
		"Solomon Islands": /^(\+677|0)\d{5}$/,
		Somalia: /^(\+252|0)\d{8}$/,
		"South Africa": /^(\+27|0)\d{9}$/,
		"South Korea": /^(\+82|0)\d{9}$/,
		Spain: /^(\+34|0)\d{9}$/,
		"Sri Lanka": /^(\+94|0)\d{9}$/,
		Syria: /^(\+963|0)\d{9}$/,
		Togo: /^(\+228|0)\d{8}$/,
		"Trinidad and Tobago": /^(\+1[868]|0)\d{7}$/,
		Tuvalu: /^(\+688|0)\d{4}$/,
		Uganda: /^(\+256|0)\d{9}$/,
		Ukraine: /^(\+380|0)\d{9}$/,
		"United Arab Emirates": /^(\+971|0)\d{9}$/,
		"United Kingdom": /^(\+44|0)\d{10}$/,
		"United States": /^(\+1|0)\d{10}$/,
		Uruguay: /^(\+598|0)\d{8}$/,
		Uzbekistan: /^(\+998|0)\d{9}$/,
		Vanuatu: /^(\+678|0)\d{5}$/,
		"Vatican City": /^(\+379|0)\d{7}$/,
		Venezuela: /^(\+58|0)\d{10}$/,
		Yemen: /^(\+967|0)\d{9}$/,
		Zimbabwe: /^(\+263|0)\d{9}$/,

		Albania: /^\d{9}$/,
		USA: /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
		UK: /^\d{4}[\s-]?\d{6}$/,
		Eurozone: /^\d{8,15}$/,
		Japan: /^\d{10,11}$/,
		Canada: /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
		Australia: /^[4-5]\d{8}$/,
		Switzerland: /^\d{9}$/,
		China: /^[1-9]\d{10}$/,
		Sweden: /^\d{6,13}$/,
		NewZealand: /^[2-9]\d{7,9}$/,
		Singapore: /^[8-9]\d{7}$/,
		HongKong: /^[5-9]\d{7}$/,
		Norway: /^\d{8}$/,
		Mexico: /^\d{10}$/,
		India: /^[6-9]\d{9}$/,
		Brazil: /^\d{10,11}$/,
		Russia: /^[1-9]\d{9}$/,
		SouthAfrica: /^\d{10}$/,
		Israel: /^[5-7]\d{8}$/,
		Thailand: /^[6-9]\d{8}$/,
		Malaysia: /^[1-9]\d{7,9}$/,
		Philippines: /^[8-9]\d{9}$/,
		UAE: /^[5-9]\d{8}$/,
		Colombia: /^\d{10}$/,
		Pakistan: /^[3-9]\d{9}$/,
		CzechRepublic: /^\d{9}$/,
		Argentina: /^\d{10,11}$/,
		Denmark: /^\d{8}$/,
		Hungary: /^\d{9}$/,
		Turkey: /^[5-9]\d{9}$/,
		Chile: /^\d{9}$/,
		SaudiArabia: /^[5-9]\d{8}$/,
		Taiwan: /^[9]\d{8}$/,
		Indonesia: /^[8-9]\d{9,10}$/,
		Vietnam: /^[3-9]\d{8,9}$/,
		Egypt: /^[1-9]\d{9}$/,
		Bahrain: /^\d{8}$/,
		Qatar: /^\d{8}$/,
		Kuwait: /^\d{8}$/,
		Morocco: /^[5-9]\d{8}$/,
		Jordan: /^\d{8,9}$/,
		Kazakhstan: /^\d{10}$/,
		Serbia: /^\d{9}$/,
		Peru: /^\d{9}$/,
		Tunisia: /^\d{8}$/,
		WestAfrica: /^\d{8}$/,
		CentralAfrica: /^\d{8}$/,
		Zambia: /^\d{9}$/,
		Nepal: /^[9]\d{9}$/,
		SriLanka: /^[7]\d{8}$/,
		Turkmenistan: /^\d{8}$/,
		Moldova: /^\d{8}$/,
		Ethiopia: /^\d{9}$/,
		Tanzania: /^\d{9}$/,
		Ghana: /^[2-9]\d{8}$/,
		Nicaragua: /^\d{8}$/,
		Bulgaria: /^\d{8,10}$/,
		BosniaHerzegovina: /^\d{8,9}$/,
		Namibia: /^\d{9}$/,
		CaymanIslands: /^\d{7}$/,
		Fiji: /^\d{7}$/,
		Macau: /^\d{8}$/,
		Mauritius: /^\d{8}$/,
		Tajikistan: /^\d{9}$/,
		Aruba: /^\d{7}$/,
		Suriname: /^\d{7}$/,
		Iceland: /^\d{7}$/,
		SierraLeone: /^\d{8}$/,
		Madagascar: /^\d{8,9}$/,
		EastCaribbean: /^\d{7}$/,
		Barbados: /^\d{7}$/,
		CFPFranc: /^\d{6,9}$/,
		PapuaNewGuinea: /^\d{8}$/,
		ElSalvador: /^\d{8}$/,
		Gibraltar: /^\d{8}$/,
		Liberia: /^\d{7}$/,
		Rwanda: /^\d{9}$/,
		Botswana: /^\d{7,8}$/,
		Kyrgyzstan: /^\d{9}$/,
		Brunei: /^\d{7}$/,
		Sudan: /^\d{9}$/,
		Libya: /^\d{8,9}$/,
		Cuba: /^\d{8}$/,
		Bhutan: /^\d{8}$/,
		DominicanRepublic: /^\d{10}$/,
		Haiti: /^\d{8}$/,
		Tonga: /^\d{7}$/,
	};
	function handleSubmit(event) {
		if (
			phone.length === 0 ||
			email.length === 0 ||
			country.length === 0 ||
			name.length === 0 ||
			message.length === 0 ||
			subject.length === 0
		) {
			console.log("Validation failed: Missing required fields");
			event.preventDefault();
			formValid = false;
			showErrors = true;
		} else {
			formValid = true;
			formSubmitted = true;
			showErrors = false;
		}
		if (!formValid) {
			event.preventDefault();
		}
	}

	// 	function handleSubmit(event) {
	//     const isEmailVerified = ProfileEmailVerified; // Assuming this is the first email verification check
	//     const isAuthedUserEmailVerified = authedUserEmailVerified; // The second email verification check
	//     console.log(isEmailVerified, isAuthedUserEmailVerified, "Email verification status");

	//     // Check if any required fields are empty
	//     if (
	//         phone.length === 0 ||
	//         email.length === 0 ||
	//         country.length === 0 ||
	//         name.length === 0 ||
	//         message.length === 0 ||
	//         subject.length === 0
	//     ) {
	//         console.log("Validation failed: Missing required fields");
	//         event.preventDefault(); // Prevent form submission
	//         formValid = false;
	//         showErrors = true;
	//         return;
	//     }

	//     // Check if email is verified
	//     if (!(isEmailVerified || isAuthedUserEmailVerified)) {
	//         console.log("Email is not verified");
	//         toast.error("Please verify your email to proceed");
	//         event.preventDefault(); // Prevent form submission
	//         formValid = false;
	//         showErrors = true;
	//         return;
	//     }

	//     // If all validations pass
	//     formValid = true;
	//     formSubmitted = true;
	//     showSuccesDiv = true;
	//     showErrors = false;
	// }

	function showMessage(message1, keywordError) {
		successMessage = message1;
		errorMessage = keywordError;
		if (keywordError === "success") {
			setTimeout(() => {
				resetForm();
			}, 2000);
		}
	}

	// $: desh = country;
	// $: {
	// console.log("desh:", desh);
	// }

	function validatePhoneNumber(country, phone) {
		const pattern = phoneNumberPatterns[country];
		if (!pattern) {
			throw new Error(
				`No validation pattern found for country: ${country}`,
			);
		}
		return pattern.test(phone);
	}
	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
		}
	};
	let searchTerm = "";
	let showDropdown = false;
	let filteredCountries = countries;

	function filterCountries() {
		filteredCountries = countries.filter(
			(country) =>
				country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				country.code
					.replace("+", "")
					.includes(searchTerm.replace("+", "").toLowerCase()),
		);
		if (
			filteredCountries.length === 1 &&
			(filteredCountries[0].name.toLowerCase() ===
				searchTerm.toLowerCase() ||
				filteredCountries[0].code.replace("+", "").toLowerCase() ===
					searchTerm.replace("+", "").toLowerCase())
		) {
			selectCountry(filteredCountries[0]);
		} else {
			showDropdown = filteredCountries.length > 0;
		}
	}
	function selectCountry(selectedCountry) {
		country = selectedCountry.name;
		searchTerm = `${selectedCountry.name} `;
		showDropdown = false;
		validatePhoneNumber(country, phone);
		delete errors.country;
	}

	// function handleInputChange(event) {
	// 	searchTerm = event.target.value;
	// 	filterCountries();
	// }
	function handleInputChange(event) {
		// Get the current input value
		searchTerm = event.target.value;

		// Track if user is deleting text
		const isDeleting =
			event.inputType === "deleteContentBackward" ||
			event.inputType === "deleteContentForward";

		if (searchTerm.length > 0 && !isDeleting) {
			// Filter countries
			filterCountriesWithoutAutoSelect();

			// Show dropdown with filtered results
			showDropdown = filteredCountries.length > 0;

			// Check for country code matches specifically
			const codeSearch = searchTerm.replace("+", "").trim();
			if (codeSearch.length > 0) {
				const exactCodeMatches = filteredCountries.filter(
					(country) => country.code.replace("+", "") === codeSearch,
				);

				if (exactCodeMatches.length === 1) {
					selectCountry(exactCodeMatches[0]);
					return;
				}
			}

			const countriesStartingWith = filteredCountries.filter((country) =>
				country.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
			);

			if (countriesStartingWith.length === 1) {
				selectCountry(countriesStartingWith[0]);
			}
		} else {
			filterCountriesWithoutAutoSelect();
			showDropdown = filteredCountries.length > 0;
		}
	}
	function filterCountriesWithoutAutoSelect() {
		filteredCountries = countries.filter(
			(country) =>
				country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				country.code
					.replace("+", "")
					.includes(searchTerm.replace("+", "").toLowerCase()),
		);
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function handleClickOutside(event) {
		if (!event.target.closest(".dropdown-container")) {
			showDropdown = false;
		}
	}
</script>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

{#if showSuccesDiv}
	<div
		class="mb-8 w-full flex items-center justify-center mx-auto max-w-7xl p-6"
	>
		<div
			class="w-full lg:w-11/12 p-10 md:w-3/4 text-center bg-white rounded-xl shadow-lg border border-green-100"
		>
			<div class="flex justify-center mb-6">
				<div
					class="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center"
				>
					<Icon
						icon="mdi:check-circle"
						class="text-5xl text-green-500"
					/>
				</div>
			</div>

			<h3 class="md:text-2xl text-xl font-bold text-green-600 mb-4">
				Submission Successful!
			</h3>

			<p
				class="md:text-lg text-base text-gray-600 mt-4 mb-6 max-w-lg mx-auto"
			>
				Thank you for reaching out! We have received your message and
				will get back to you as soon as possible.
			</p>

			<div class="w-10/12 mx-auto my-6 border-t border-green-200"></div>

			<div class="flex items-center justify-center gap-4">
				<a
					href="/"
					class="bg-white text-green-600 border border-green-500 px-6 py-3 rounded-full font-medium hover:bg-green-600 hover:text-white transition-all duration-300 flex justify-center items-center shadow-sm hover:shadow-md"
				>
					<Icon icon="mdi:home" class="text-xl mr-2" />Back to Home
				</a>
				<button
					on:Click={() => location.reload()}
					class="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-all duration-300 flex justify-center items-center shadow-sm hover:shadow-md"
				>
					<Icon icon="mdi:message-text" class="text-xl mr-2" />Send
					Another Message
				</button>
			</div>
		</div>
	</div>
{:else if showFailureDiv}
	<div
		class="pb-20 pt-20 h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl mb-10 sm:text-sm text-xs"
	>
		<div
			class="w-10/12 md:w-8/12 bg-gradient-to-r from-red-100 via-red-50 to-red-100 p-8 rounded-lg shadow-lg text-center"
		>
			<p class="sm:text-md text-sm text-gray-700 mb-6">
				There was an issue with submitting the form. Please try again
				after a while.
			</p>

			<div class="w-10/12 mx-auto my-6 border-t-2 border-red-300"></div>
			<div>
				<a
					href="/feedback"
					class="sm:text-sm text-xs bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md hover:bg-primary-500 hover:text-white transition"
				>
					Report Issue
				</a>
			</div>
		</div>
	</div>
{:else}
	<section
		class="my-10 w-11/12 max-w-3xl flex flex-wrap justify-center mx-auto sm:p-0 font-roboto"
	>
		<div
			class="w-full border border-gray-200 rounded-xl shadow-lg overflow-hidden bg-white"
		>
			<h1
				class="sm:text-2xl text-xl font-bold bg-green-600 text-white py-5 px-6 flex items-center justify-between"
			>
				Get in Touch with Us
				<i class="iconify text-2xl" data-icon="mdi:email-fast-outline"
				></i>
			</h1>
			<form
				method="POST"
				action="?/contactus"
				class="space-y-4 p-6"
				bind:this={form}
				use:enhance={(event) => {
					//   const isEmailVerified = ProfileEmailVerified;
					//   const isAuthedUserEmailVerified = authedUserEmailVerified;
					//   console.log(
					// 	isEmailVerified,
					// 	isAuthedUserEmailVerified,
					// 	"Email verification status",
					//   );
					//   if (!(isEmailVerified || isAuthedUserEmailVerified)) {
					// 	console.log("Email is not verified");
					// 	toast.error("Please verify your email to proceed");
					// 	event.preventDefault();
					// 	return () => {};
					//   }
					submitting = true;
					return async ({ result }) => {
						let message1 = "";
						let keywordError = "";
						console.log(result);
						keywordError = result.data.type;

						if (keywordError === "success") {
							message1 = result.data.data.message;
							submitting = false;
							showSuccesDiv = true;
							console.log(message1);
						} else if (keywordError === "error") {
							message1 = result.data.data.error;
							submitting = false;
							toast.error(message1);
							showFailureDiv = true;
							console.log(message1);
						}

						showMessage(message1, keywordError);
					};
				}}
			>
				<input
					type="hidden"
					name="country"
					id="country"
					bind:value={country}
				/>

				<div class="mb-8">
					<p class="text-xl text-green-700 font-bold">
						Send a Message
					</p>
					<p class="text-gray-600 mt-2">
						We'd love to hear from you! Send us a message, and let's
						stay connected.
					</p>
				</div>

				<div class="space-y-5">
					<!-- Name Field -->
					<div class="relative">
						<div
							class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
						>
							<Icon
								icon="mdi:account"
								class="text-green-500 text-xl"
							/>
						</div>
						<input
							type="text"
							name="name"
							id="name"
							bind:value={name}
							class="block w-full pl-10 pr-3 py-4 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-green-500 transition duration-300 bg-gray-50 rounded-t-lg text-gray-700"
							placeholder="Your Name"
						/>
						{#if showErrors && name.length === 0}
							<span
								class="text-red-500 text-xs font-medium mt-1 block"
								>Name is required</span
							>
						{/if}
						{#if name.length > 0 && !/^[A-Za-z\s]+$/.test(name)}
							<span
								class="text-red-500 text-xs font-medium mt-1 block"
								>Name cannot contain numbers or special
								characters</span
							>
						{/if}
					</div>

					<!-- Email Field -->
					<div class="relative">
						<input
							type="hidden"
							name="email"
							id="email"
							bind:value={email}
						/>
					
							<div class="relative">
								<div
									class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
								>
									<Icon
										icon="mdi:email"
										class="text-green-500 text-xl"
									/>
								</div>
								<input
									type="text"
									name="email"
									id="email"
									bind:value={email}
									class="block w-full pl-10 pr-12 py-4 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-green-500 transition duration-300 bg-gray-50 rounded-t-lg text-gray-700"
									placeholder="Your Email"
									on:input={() => {
										email = email.trim();
										ProfileEmailVerified = false;
										emailSent = false;
										authedUserEmailVerified = false;
									}}
								/>

								{#if showErrors && email.length === 0}
									<span
										class="text-red-500 text-xs font-medium mt-1 block"
										>Email is required</span
									>
								{/if}
								{#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
									<span
										class="text-red-500 text-xs font-medium mt-1 block"
										>Please enter a valid email address.</span
									>
								{/if}

							
							</div>
					

					
					</div>

					<!-- Country & Phone Fields -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
							>
								<Icon
									icon="mdi:earth"
									class="text-green-500 text-xl"
								/>
							</div>
							<input
								type="text"
								bind:value={country}
								placeholder="Country"
								on:input={handleInputChange}
								on:click={toggleDropdown}
								class="block w-full pl-10 pr-10 py-4 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-green-500 transition duration-300 bg-gray-50 rounded-t-lg text-gray-700"
								required
							/>
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button
								type="button"
								class="absolute inset-y-0 right-0 pr-3 flex items-center"
								on:click={toggleDropdown}
							>
								<i
									class="iconify text-gray-500"
									data-icon={showDropdown
										? "ep:arrow-up-bold"
										: "ep:arrow-down-bold"}
								></i>
							</button>

							{#if showDropdown}
								<div
									class="absolute w-full bg-white border border-gray-200 rounded-md shadow-xl z-10 mt-1 max-h-60 overflow-y-auto"
								>
									<ul class="py-1">
										{#each filteredCountries as country (country.name)}
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
											<li
												on:click={() =>
													selectCountry(country)}
												class="px-4 py-2 cursor-pointer hover:bg-green-50 text-gray-700 hover:text-green-700 transition duration-150"
											>
												{country.name} ({country.code})
											</li>
										{/each}
										{#if filteredCountries.length === 1}
											<div
												class="px-4 py-2 text-gray-600 text-xs"
											>
												No matching countries found!
											</div>
										{/if}
									</ul>
								</div>
							{/if}

							{#if showErrors && country.length === 0}
								<span
									class="text-red-500 text-xs font-medium mt-1 block"
									>Country is required</span
								>
							{/if}
						</div>

						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
							>
								<Icon
									icon="mdi:phone"
									class="text-green-500 text-xl"
								/>
							</div>
							<input
								type="tel"
								name="phone"
								id="phone"
								bind:value={phone}
								class="block w-full pl-10 pr-3 py-4 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-green-500 transition duration-300 bg-gray-50 rounded-t-lg text-gray-700"
								placeholder="Phone Number"
							/>
							{#if showErrors && phone.length === 0}
								<span
									class="text-red-500 text-xs font-medium mt-1 block"
									>Phone number is required</span
								>
							{/if}
							{#if phone?.length > 0 && !validatePhoneNumber(country, phone)}
								<span
									class="text-red-500 text-xs font-medium mt-1 block"
									>Please enter a valid phone number for {country}</span
								>
							{/if}
						</div>
					</div>

					<!-- Subject Field -->
					<div class="relative">
						<div
							class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
						>
							<Icon
								icon="uis:subject"
								class="text-green-500 text-xl"
							/>
						</div>
						<input
							type="text"
							name="subject"
							id="subject"
							bind:value={subject}
							class="block w-full pl-10 pr-3 py-4 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-green-500 transition duration-300 bg-gray-50 rounded-t-lg text-gray-700"
							placeholder="Subject"
						/>
						{#if showErrors && subject.length === 0}
							<span
								class="text-red-500 text-xs font-medium mt-1 block"
								>Subject is required</span
							>
						{/if}
					</div>

					<!-- Message Field -->
					<div class="relative">
						<div
							class="absolute top-4 left-0 pl-3 flex items-start pointer-events-none"
						>
							<Icon
								icon="mdi:message-text"
								class="text-green-500 text-xl"
							/>
						</div>
						<textarea
							name="message"
							id="message"
							bind:value={message}
							class="w-full pl-10 pr-3 py-4 border border-gray-200 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-300 rounded-lg bg-gray-50 text-gray-700 h-36 resize-none"
							placeholder="Your Message"
						></textarea>
						{#if showErrors && message.length === 0}
							<span
								class="text-red-500 text-xs font-medium mt-1 block"
								>Message is required</span
							>
						{/if}
					</div>
				</div>

				<input type="hidden" name="status" value="unread" />

				<!-- Submit Button -->
				<div class="mt-8 flex justify-center">
					<button
						type="submit"
						on:click={handleSubmit}
						class="w-full md:w-1/2 py-4 bg-green-600 text-white text-lg font-bold rounded-full transition-all duration-300 hover:bg-green-700 hover:shadow-lg flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
					>
						{#if submitting}
							<Icon
								icon="line-md:loading-alt-loop"
								class="text-2xl"
							/>
							<span>Sending...</span>
						{:else}
							<Icon icon="mdi:send" class="text-lg" />
							<span>Send Message</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</section>

	<Toaster position="bottom-right" richColors />
{/if}
