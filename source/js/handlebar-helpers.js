Handlebars.registerHelper('upper', function(str) {
	return str.toUpperCase()
});

Handlebars.registerHelper('firstUpper', function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

Handlebars.registerHelper('formatDate', function(date){
	return moment(date).format('MM/DD/YYYY HH:mm')
})

Handlebars.registerHelper('formatTime', function(date){
	return moment(date).format('HH:mm')
})

Handlebars.registerHelper('ifEqual', function(a,b, opts){
	if(a==b){
		return opts.fn(this)
	}
	else {
		return opts.inverse(this)
	}
})

Handlebars.registerHelper('ifNotEqual', function(a,b, opts){
	if(a!=b){
		return opts.fn(this)
	}
	else {
		return opts.inverse(this)
	}
})

Handlebars.registerHelper('ifIn', function(a,b,opts){
	if(b.indexOf(a) > -1){
		return opts.fn(this)
	}
	else {
		return opts.inverse(this)
	}
})

Handlebars.registerHelper('ifHasPast', function(date, opts){
	if(moment(date).isAfter(moment())){
		return opts.inverse(this)
	} else {
		return opts.fn(this)
	}
})

Handlebars.registerHelper('eachSlice', function(array, opts){

	var slice = 10
	var s = ''

	if(array.length<10){
		slice = array.length
	}
	
	for(var i=array.length-1; i>=array.length-slice;i--){
		s+=opts.fn(array[i])
	}

	return s;
})