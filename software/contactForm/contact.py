from django.core.mail import send_mail
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
#Python Test with Django

def contact(request):
		errors = []
		if request.method == 'POST':
				if not request.POST.get('subject', ''):
						errors.append('Enter a subject.')
				if not request.POST.get('message', ''):
						errors.append('Enter a message.')
				if request.POST.get('email') and '@' not in request.POST['email']:
						errors.append('Enter a valid e-mail address.')
				if not errors:
					try:
						send_mail(
								request.POST['subject'],
								request.POST['message'],
								request.POST.get('email', 'support@ruunalbe.com'),
								['siteowner@example.com'],
						)
						return HttpResponse('Thank you, form has been submitted successfully')
					except Exception, err: 
						return HttpResponse(str(err))
		return render(request, 'contact_form.html',
				{'errors': errors})