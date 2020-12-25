import React, { Component } from 'react';

import Backend from './../Backend';

import MailHeader from './MailHeader.jsx';

export default class Read extends Component {

	static testMail = {
		"Content-Type": {
			"boundary": "----=_Part_194654_1608866954.1608462070858",
			"raw": "multipart/alternative; boundary=\"----=_Part_194654_1608866954.1608462070858\"",
			"type": "multipart/alternative"
		},
		"Date": "Sun, 20 Dec 2020 12:01:10 +0100 (CET)",
		"From": [
			{
				"address": "noreply@oui.sncf",
				"name": "oui.sncf"
			}
		],
		"Subject": "Votre voyage Bordeaux St Jean - Roche",
		"To": [
			{
				"address": "clovis@mail.byte49.exposed",
				"name": ""
			}
		],
		"others": {
			"Authentication-Results": "byte49.exposed; dkim=pass (1024-bit key;unprotected) header.d=oui.sncf header.i=@oui.sncf header.b=\"f6rULb7R\"; dkim-atps=neutral",
			"Content-Type": "multipart/alternative; boundary=\"----=_Part_194654_1608866954.1608462070858\"",
			"DKIM-Filter": "OpenDKIM Filter v2.11.0 mta2.voyages-sncf.com 0DF1B360",
			"DKIM-Signature": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=oui.sncf; s=oui;t=1608462071; bh=pce1Wm4Y4DYFMjIZP7/9LcKkASRAvBWRBAbyNarW+c8=;h=From:To:Subject:From;b=f6rULb7RRNmmNUAvanRa1iMsxP34o6VWOhjs9psvE6ebw+m+ykhEbOVnJWqzXGHm69oR56qrucMjAyrjP7zbhvLPA5CWQK6uaVn01s5Rj74enBeNn0CiAnjH0Y7dIf8kwtgdzXqk9Ha5kr/W82lRL8z2+yo09tbUiBwFx1naFpg=",
			"Date": "Sun, 20 Dec 2020 12:01:10 +0100 (CET)",
			"Delivered-To": "clovis@mail.byte49.exposed",
			"From": "\"oui.sncf\" <noreply@oui.sncf>",
			"MIME-Version": "1.0",
			"Message-ID": "<956660210.194655.1608462070859.JavaMail.wasvctp6@gradignan>",
			"Received": "from mta2.voyages-sncf.com (mta3.voyages-sncf.com [90.80.158.139])(using TLSv1.2 with cipher AECDH-AES256-SHA (256/256 bits))(No client certificate requested)by byte49.exposed (Postfix) with ESMTPS id C3D44207BC0for <clovis@byte49.exposed>; Sun, 20 Dec 2020 11:01:11 +0000 (UTC)",
			"Return-Path": "<noreply@oui.sncf>",
			"Subject": "=?UTF-8?Q?Votre_voyage_Bordeaux_St_Jean_-_Roche?==?UTF-8?Q?fort,_aller_le_lundi_21_d=C3=A9cembre_2020?=",
			"To": "clovis@byte49.exposed",
			"X-GPG-Mailgate": "Encrypted by GPG Mailgate",
			"X-Original-To": "clovis@mail.byte49.exposed"
		}
	};

	static testFolder = "INBOX";


	constructor(props) {
		super(props);
	}

	render = () => (
		<MailHeader mail={ Read.testMail } />
	);
}