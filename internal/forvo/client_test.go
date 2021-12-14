package forvo

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
)

const exampleJSON = `
{
	"attributes": {
		"total": 10
	},
	"items": [
		{
			"id": 797335,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2010-09-30 11:18:22",
			"hits": 5472,
			"username": "_ai_",
			"sex": "f",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/313e3a23273e2g351h213f1p243f2d392c283h1b1i332f2f37311p3f2j3p332q3n2c28212l2e3l211f37232c2k382i3c312a1p2b3j3o3o1g37211i322o233e2m3l382l2h1f1i2p321n2j3p1h3n232j2o1o2k343c39211t1t_321h252g3n3k3l2b3i1i2m3g2135371l313b22242b371t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/3a3l1b2h3h1f2g2c2a2c1b3o1b1j221j2l1n2c3a2i3n2h1o3n2b3g323p1h2b3n2l2h2m213d2j3f2m1k322q2l262p2738312137251m32293q3f3d252b2f38362k1b2b3823372f2i1b3n1h3f2p1g283n3a1m2m3h1m3m211t1t_3c3d331b322237322f1b343g361o3l38393k31351n211t1t",
			"rate": 3,
			"num_votes": 3,
			"num_positive_votes": 3
		},
		{
			"id": 2637281,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2013-12-03 04:43:19",
			"hits": 1739,
			"username": "shamytam206",
			"sex": "m",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/3p39351b272q3l3l3l3k3j1l1o232b1n1f1j3d1n2k3n3n2h353h222h3e373o1p2h1b2e2c3o24293n3m3p3c1i263j2a261i2a3m3a3f342a3j2j261j3l3p373e2f2436291o1n1m1m311j3m273k3b1j24213k362b1n313n1t1t_3h1b2l3c3m3e322j3i1n2c1h2a2h2f2h3l37273e372h1t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/2d2d3g3c2j3o1p1n3o2d3f1f2o1o223h371p3i362b3q2j3d3d2g1j39341k3f3e1n1b1j3d1h2f1g2b1k1f273f3b3n363q343d3n3a3k2e2h2c38351j382d3l3c1f3a312d1k3l3n2n26342l2j1h262q293b2l352c1l1h211t1t_3i2g323o2b1h1b2b1n2g2a3o1g32352a2q3q351o3o211t1t",
			"rate": 0,
			"num_votes": 2,
			"num_positive_votes": 1
		},
		{
			"id": 4059305,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2015-12-26 06:07:46",
			"hits": 1800,
			"username": "usako_usagiclub",
			"sex": "f",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/311n2q1g2q2d2o2b272b2i1m232e263a2b2f391b392b3g3q2e3k2q2j3c252o3a381i3m322b252j2j1i1i3i1l323c2m3g3a281h1k2i2d2c3a292d35361k2d382f2e3h1f393g1p1f352j2h1m1p3q393n3i1g3i39242h371t1t_1k2b372e271f3j3d1p2k1i3m293f3q1n2b1i361j3d2h1t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/2a2q3n2731213b2a2m36281f1p2g3i212d2q223a2d1b3c2p331o3m2q1h2g213d2j3h2o3m1j2n2c352l38223h263p1j3d2m3p1f3m3n2o2f1f2d383g1j292n3h341k1o3f3n2d2j2g2o212f281i2p2j391j2o1j3h3j28371t1t_1j3k1f3a2i242g3j2l2h392d3o2i3h2p2m253a373p2h1t1t",
			"rate": 0,
			"num_votes": 0,
			"num_positive_votes": 0
		},
		{
			"id": 4844514,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2017-02-26 05:11:11",
			"hits": 1185,
			"username": "skent",
			"sex": "m",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/293238212k3f2q1b2q2k1l2h2m251o1m1i3f262j1p1p322b211j2d2m3j3k1o372l1i23392p3826231b2l352q342m2h1m3d3d2p3q1h2j2l2g2m363b1l2934232p3o2f1j1l3d2e2c1g22311m322i3d211p362n2p373i2h1t1t_383p231l3m241k2h3i3p292k39233q2m1i213g291j211t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/3k3f1o2f3o3l2a21293o1p333e2l241p1i371k3j313a371k2q3d3o343m39281k3o2k3e2l2q3e261m1l1m1h1n36272c2f1o341i29362e1j2638353q3e1k3n2g2q2j2b2l3d3f31223l3h2o2i1g3m1j3k3q3c291h3g2p211t1t_323o39363b3a3d1b3i362f2c3n2b2b242d1p3k3f3d371t1t",
			"rate": 1,
			"num_votes": 1,
			"num_positive_votes": 1
		},
		{
			"id": 5038313,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2017-06-08 07:57:57",
			"hits": 616,
			"username": "Akiko3001",
			"sex": "f",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/2j2m2n253b1i371o3o252e3g2c2g383f3m2h3p2q3g3k1b3q262k231l2d1o382a3i2n1i1j2k34353j373b353g1g3f1g2c1f1o3p2e1p1b262a341n232a3a1m3d2q3g353p3b1k32291o3n1m1n3l3j3g2c372f2i1j3d1k371t1t_2f332o2i3e2k1m3o1k1k263p1g3k262g3m1g37391m211t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/2e2g331b231f3d1m2i211o1p282q24363a3i2g1l3g2b1l313o373j2h2l273p273k251o2o1b36293f1p313k3k241p343i2g1m3m2f39231i3j2a342b3j253c2931332g342b2i333c3i262a383h3h373d222o3m282o1p211t1t_3c2e1m2c3h1i1p3q231p3j1m2j3p1l263m3d3p392f3n1t1t",
			"rate": 0,
			"num_votes": 0,
			"num_positive_votes": 0
		},
		{
			"id": 5185613,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2017-09-03 16:22:54",
			"hits": 1212,
			"username": "le_temps_perdu",
			"sex": "m",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/311f39223a292d23232c1j243e3m3e3p2g2k1m1j1l2q232i321h3j27243a322p222q3a233h2n2b351l3e1i2k3k2a3l1n2n3c1i3939273a3p322o3a2e282d3c242o391i3g24333e333h2q232o1n2l2a313j1m3a1l282h1t1t_2d352f221p313h1m293n1h1o332j3a1l1f2m2h3f3i371t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/2g2c2i2l2n2g2e3636231k3l382d392d223e2d2o27212p2i3d1f1g2936353q2j1m27211p3g312c213o1h2g2a2d36292b1k2i1p3a3j26242q1g233h23313g3c1g2k1b2i3c3h1m2e2l3n2o2l321l2q3a1h3i372n1j353n1t1t_2m2p393i3g362g2d272l34343g2k3p21313m222i2a211t1t",
			"rate": 1,
			"num_votes": 1,
			"num_positive_votes": 1
		},
		{
			"id": 5185871,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2017-09-03 23:23:06",
			"hits": 335,
			"username": "YoYoUeda",
			"sex": "f",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/3m3a2c3k2k1g3j2i32233h3a3j393g3q2p35291m3m312n2o2d282m3c3a1n1b2m293b2j1i3m3h2i212e3p2k282i27211i1o2c2o1h2f343j2e1k3n1f353k393b1m39391f3l3i342n1f3p321o273p281g2c2c3h2n3a1b211t1t_3i38273b39341m1f232f372l2k2d2l283q1h2k341h211t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/1n24251b3c3h3n2i393n3o2p3q1k2d3d352o373f3q1b2b2h2q2g393f3j3g283m2h343f3k3c1h2b1o2q2827243d311b1g223e3p241m2d1b3j35292c2k372b1k2q2d2p2n3f2f1i3k1l2n3q31371o3g342p242m2g3m323n1t1t_291p2l262k3f221n3f343d281h2c1o1f343o3f231p371t1t",
			"rate": 0,
			"num_votes": 0,
			"num_positive_votes": 0
		},
		{
			"id": 5235419,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2017-09-28 07:42:24",
			"hits": 396,
			"username": "straycat88",
			"sex": "f",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/1p2k213k3l371m2d2m2b362i22343a3l2p28313o2o3o2b27322b3i222n36282e1o292f2i2l3m32341i1g3n2c373a3b1n3g2l3g1n31263n3a1p1b1g2f3e3d2j3931222g292o1k3q37212b271p2i291b361b3b29373h211t1t_2n1k282c2q2e2b1m3m1g3a311f3b243n1m3m293h1k371t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/36322d2335353m2d3f1n3l2k3i213k2l3o383b1o3i2j353j212m2b2a2e2c2l33341o2g362h283d3c2d1n36373q233m3m2n2a2e2o1l1h3c1l362e3a2e3h3a3n383k3j2323371b3n1p3l2q313o321j3m3m3n3c3j331o2h1t1t_1b321m2f261l3h1k252l3j1j3c313833243k2f333q371t1t",
			"rate": 0,
			"num_votes": 0,
			"num_positive_votes": 0
		},
		{
			"id": 5249488,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2017-10-04 04:59:23",
			"hits": 364,
			"username": "hentai",
			"sex": "m",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/1h243j1l3i253j3o1h312l2f3j1j1j3h3l1n22233q3k372b361b283h3237333j231g2e3q2g3f29361g3p1j2p3i2h1p3f2g372d2i3o1n1b1j3n2k3j2o3q2k3732332d1m1i2e2g2p1b2h2n3j271l1b1g3d22372o39262h1t1t_1j27312i24373f2g2h312l1n383l2k3p3h1b2j3p3l2h1t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/323q362l1n2d372g1o3n3g331m2h1f2c1m1n3e2o372f3o3p1p312p1m1n2i252o3h2f25252b2g3j283b233e3f2b3d263o3m2d2b3n3n3h1p251n312k392n3i381n252i2o1j2a3e1g1i3a252i2d2p23332e1k1k211l2l371t1t_3o312n2b231m3i2c351l2d3n3n3f283b391b3f1n2c371t1t",
			"rate": 0,
			"num_votes": 0,
			"num_positive_votes": 0
		},
		{
			"id": 6227819,
			"word": "\u8f9e\u66f8",
			"original": "\u8f9e\u66f8",
			"addtime": "2019-07-13 06:15:42",
			"hits": 130,
			"username": "monekuson",
			"sex": "m",
			"country": "Japan",
			"code": "ja",
			"langname": "Japanese",
			"pathmp3": "https:\/\/apifree.forvo.com\/audio\/3d26332l2g27361o2l362e2p2m2m232k3k3i1l221m2e1g1j3k3e261i3a3h2d1m2l263f1i2m3f1j2n2e2f2b2l212c2d292m2935361l1p282m362c1f1m1m3n2f3e3d3q1j271k1n223q1b242q252c3n1l2l352a222d2h2h1t1t_2g2j2n29243b373836243f2n3236343n2d2o272c2g2h1t1t",
			"pathogg": "https:\/\/apifree.forvo.com\/audio\/3f3k323b1p1i1f2l2m1m223o222i373k2i241p323q39282l26322o381m2n3e2h2o3e1b3k383f3a3l1m2n352g3d3b1k341p3m3m2f2m1f2i1f2i3g3m3k3c3f393b3i272h2a2i2335223133362k3p22381k3b3a2p2j2l211t1t_323k3g1j2d222k2i3g2h3b3e1i293p2j3h2d372i3n3n1t1t",
			"rate": 0,
			"num_votes": 0,
			"num_positive_votes": 0
		}
	]
}
`

func TestJsonParsing(t *testing.T) {
	var pronunciations PronunciationList
	err := json.Unmarshal([]byte(exampleJSON), &pronunciations)

	if err != nil {
		t.Error("err was supposed to be nil")
		t.Error(err.Error())
	}

	assert.Equal(t, 10, len(pronunciations.Items), nil)
}
