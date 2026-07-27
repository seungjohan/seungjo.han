---
title: Developing a Web Product for an Early-stage Startup from scratch
subtitle: You need to know software development to build your ideas into products.
date: September 26, 2024
tags: [Startup, Technology, Product]
excerpt: How I went from zero programming knowledge to shipping a full-stack web product — and what that process taught me about building startups.
coverImage: /blog-images/developing-a-web-product-for-an-early-stage-startup-from-scratch_1.JPEG
focusKeyword: web product for a startup
secondaryKeywords: [full-stack development, startup]
---

# Developing a Web Product for an Early-stage Startup from scratch

### You need to know software development to build your ideas into products.

*By Seungjo Han · Sep 26, 2024*

---

![Having an engineering meeting in our office](https://substackcdn.com/image/fetch/$s_!-HLc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9e8fc16b-a34f-4803-80c4-0abbe6a97e76_4032x3024.jpeg)

*Having an engineering meeting in our office*

Although I didn't major in programming, my experience in running a startup led me to recognize the necessity of programming skills, prompting me to start learning software development. The process from starting at zero to the culmination of building a fully-functional product took a significant amount of time.

While developing the website, I often found myself reflecting on the question, *"Why do you want to learn programming?"* If I could go back in time and talk to my past self, I could provide myself with a multitude of answers to this question. Similarly, there may be some readers who are either complete novices, or who may have some basic understanding of software development, that might be wondering:

> *Is software development truly necessary for running a startup?*
> *How do I even begin developing a product for a startup?*
> *What methods do other startups use to develop their products?*

Given these common questions, I decided to document the entire process of developing a product in a startup setting. I would be happy to share the wisdom that I have gained through my own experiences with others, in the hopes of motivating or guiding them on their own startup or software development journeys.

Founding and running **Webeing, a startup focused on selling unsold inventory and products nearing their expiration dates from a variety of partnered restaurants to promote environmental sustainability**, made me realize the necessity of software development. So, I decided to take action and learn.

It is impossible to run a startup without knowledge of IT. However, without team members who possess advanced software development knowledge, navigating this terrain is incredibly challenging. Many questions arise, such as when to start development, how to design the architecture, how to budget for outsourcing, and what features are necessary. This motivated me to learn programming and take on the development role for myself.

As I embarked on this path, I found myself overwhelmed by the numerous unknowns in full-stack development (frontend + backend), server management, deployment, and more. My only framework experience came from learning Django through 'LikeLion', a student-run programming educational community, and my programming language proficiency was limited to C and Python, which made the process daunting.

Fortunately, I had the help of my friends from 'LikeLion,' to develop this service together. Although our service had already passed the planning stage, we decided to **revisit and strengthen our overall plan to enhance competitiveness and transition our ideas into development.**

![Having an online meeting and coding](https://substackcdn.com/image/fetch/$s_!Ur-U!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3d205970-8ce2-4598-a9d4-f22be839d358_3908x1096.png)

*Having an online meeting and coding*

---

## Planning and Prototype Design

Just as a solid foundation is crucial for building a stable structure, my team dedicated a significant amount of time to **planning and design**.

I am deeply grateful to my four team members. Their commitment and responsibility matched my determination as the team leader, which amplified our synergy.

In collaborative environments, I prefer candid and critical discussions over unanimous decisions. Despite being close friends, my Webeing team and I approached our meetings with the former mindset. This developed a comfortable environment that promoted honesty and quality feedback, without an atmosphere of defensiveness or judgement.

![Making a flowchart of our prototype](https://substackcdn.com/image/fetch/$s_!SkDa!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3d76f4d4-7f65-48fa-9005-ce0a25b8398f_1440x1080.jpeg)

*Making a flowchart of our prototype*

During the planning phase, we focused on **identifying ways to maximize our service's unique features** and brainstormed additional functions that could further differentiate our product from others on the market.

We decided to enhance our service by incorporating a map API to make pickups more convenient for consumers, and by creating a feature where consumers could collect and use 'environmental points' through utilizing Webeing, which could then be redeemed for other goods and advantages. This way, users would feel a tangible sense of contributing to environmental protection. We also planned, and later implemented, various other features.

To enhance a user-friendly experience, we deliberated on **which features each page would require** and **the most effective locations for these features on the page**. As a result, we benchmarked other existing websites to provide us with inspiration.

The best benchmarking often comes from studying competitors within the same industry, as their websites tend to be user-friendly and familiar to consumers. We referenced websites from companies such as 'Too Good To Go', 'Delivery Hero', and Korean food-delivery services such as 'Baemin (배달의 민족)', 'Yogiyo (요기요)', and 'Last Order (라스트오더)'. For a more detailed explanation of our prototyping process, please refer to my [previous post](https://seungjohan.substack.com/p/designing-a-prototype-for-a-startup).

---

## Development and GitHub Collaboration

With the groundwork laid, we began the development phase in earnest. **Collaboration in development necessitates the use of Git**. However, Git can be quite challenging to understand initially, and adapting to it was a significant hurdle for me.

I had previously learned Git but had found it difficult to fully grasp. Thankfully, one of our team members had developed excellent software development skills during an internship he had completed and furthered our understanding of it. By applying the rules he had learned from his internship company, we managed to proceed with development in a much more structured manner.

![Engineering guide for Github cooperation](https://substackcdn.com/image/fetch/$s_!Op_e!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F961b43a4-9ba1-40be-850f-64fc939ab4a7_1810x896.png)

*Engineering guide for Github cooperation*

For a deeper understanding of our development process using Git, you can refer to our GitHub repository:

[**GitHub — seungjohan/webeing →**](https://github.com/seungjohan/webeing)

With our team of five, we divided various tasks and roles. We split the work between front-end and back-end, and within the full stack, I primarily focused on the front-end.

Originally, our goal was to utilize Vue.js and Django Rest Framework (DRF), with a clear separation between front and back ends, but we ended up using only Django. This was due to the volume of work and the limited time we had to learn new technologies. This was my first major project, and as I was also studying HTML, CSS, and JavaScript simultaneously, I faced numerous challenges. One other team member had been supporting me on the front-end during this time, but when he was moved to the back-end to assist them, I had to invest much more of my time in developing the front-end, alone.

Creating the landing page alone took several weeks. Progress was slow initially, but after completing the first page, my understanding improved, allowing me to develop other pages more quickly.

![Organizing and positioning features by frame](https://substackcdn.com/image/fetch/$s_!mKdi!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc5ef8c91-2284-45ff-bc33-aabcc3796f65_1921x721.png)

*Organizing and positioning features by frame*

Spending ample time on **prototyping** greatly facilitated front-end development.

In real-world practice, back-end tasks are often completed and deployed before front-end development, to ensure that every function runs seamlessly. However, the necessity of integrating back-end modules and linking pages sometimes meant that the prototype could not be fully implemented as planned. For instance, adding a shopping cart module unexpectedly introduced unnecessary UI elements:

> Inventory Main Page → Inventory Detail Page → Shopping Cart Page → Checkout Page → Order Confirmation Page

![Brief item card design made by Bootstrap — Left: inventory page, Right: order confirmation page](https://substackcdn.com/image/fetch/$s_!ajzb!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff84d4e62-42f9-41ce-9ee2-673fb263e055_2244x896.png)

*Brief item card design made by Bootstrap (Left: inventory page, Right: order confirmation page)*

This flow added unnecessary steps, so we streamlined the process to allow users to skip the inventory detail page when purchasing. Despite this amendment, we faced several other obstacles, such as unattractive item card designs on the main page.

![Linking Payment Gateway (PG) to our service](https://substackcdn.com/image/fetch/$s_!75Xl!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0bebcd25-f63f-4141-9dd2-f829c73ebb7c_2652x1590.png)

*Linking Payment Gateway (PG) to our service*

During the integration of the payment module using Port One, formerly known as iamport ([portone.io](https://portone.io/korea/ko)), we encountered several functional issues, such as payments being recorded even after cancellations, and aesthetic shortcomings.

![The beta version of the profile page — Left: for normal users, Right: for restaurant owners](https://substackcdn.com/image/fetch/$s_!VpSM!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdee6d983-d5e4-498a-8794-8776b0d30e3f_2704x896.png)

*The beta version of the profile page (Left: for normal users, Right: for restaurant owners)*

![Left: main page, Right: cart page](https://substackcdn.com/image/fetch/$s_!dRFW!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F209c742c-1992-4358-aef6-14949b9e45f3_3321x896.png)

*Left: main page, Right: cart page*

These are some of the revisions made during webpage development. We continually checked that all necessary information was correctly conveyed on each page and adjusted the front-end accordingly.

---

## Deployment Using AWS and Domain Connection

After completing development, we used **AWS to create an EC2 instance for deployment.** This process was not without its own challenges.

We encountered issues when uploading store information, and inventory images stored in the database. The `static_root` and `media_root` settings were not configured correctly, causing continuous problems with image uploads. Additionally, routing the domain purchased from [Gabia](https://www.gabia.com/), our payment gateway (PG), to the Elastic Beanstalk URL took longer than expected due to our lack of experience.

![Error page by linking service to the root domain](https://substackcdn.com/image/fetch/$s_!qSEw!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3e6c40d7-bed2-4f7d-9508-3169f42c7f8d_4035x1248.png)

*Error page by linking service to the root domain*

While blogs can be helpful, I strongly recommend **referencing the AWS documentation** for deployment and domain connection. It's the most accurate resource.

Many blogs suggest using several commands for deployment, and often include the command `sudo`. This command grants root access, bypassing all server management permissions. While it does work, it is also a risk as it compromises security by circumventing all authorization procedures. I strongly recommend avoiding the use of this command whenever possible.

- [Deploying a Django application to Elastic Beanstalk →](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html)
- [How to Register a Domain Name with Route 53 →](https://aws.amazon.com/getting-started/hands-on/get-a-domain/)

After approximately more than six months of hard work, we successfully launched the service and submitted it to the 'LikeLion Hackathon.' Out of around 70 participating teams, we proudly won a gold award by securing second place.

![Online hackathon award received during Covid-19](https://substackcdn.com/image/fetch/$s_!zpZd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F907c2359-ca14-4bb3-819b-ec2690f30d7b_1280x728.png)

*Online hackathon award received during Covid-19*

**My goal was not merely to submit this project for the hackathon, but to have it enter the market and generate consumer traffic.** Following the deployment to the market, we actively marketed the service to acquaintances and Webeing partners, resulting in some transactions, albeit limited to our close contacts.

![Payment history from the service 'Webeing'](https://substackcdn.com/image/fetch/$s_!_PuO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb6c0db81-4ecc-48e0-8ae6-759df2dbe634_1746x244.png)

*Payment history from the service 'Webeing'*

Due to issues with the PG, some refunds had to be processed, and these payments were only able to be received through personal accounts, via Korea's mobile payment system, KakaoPay. The PG was reluctant to approve contracts with intermediary platforms like Webeing, posing challenges in obtaining contract approval. Additionally, we received feedback about the user interface being inconvenient, indicating that the quality wasn't sufficient for a market launch. Given the nature of our service, web and app integration was crucial. Unfortunately, with Django, app integration was challenging. We promoted and tested the web version with acquaintances and partners for several months, after which we noticed that it was largely unused by our users.

**Initially, accepting this reality was difficult.** After months of sleepless nights and hard work, abandoning the project just months after launch was heartbreaking. I experienced a period of depression, questioning my motivation and losing interest. However, I resolved to change my perspective.

---

## Feedback

Refocusing my efforts, I sought feedback to improve future projects and avoid repeating the same mistakes. I collected input on what was lacking in Webeing, and what users found most inconvenient.

![Receiving feedback from people such as previous users, startup experts, CEOs, designers, and others](https://substackcdn.com/image/fetch/$s_!rEgt!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5ed08e25-a678-41da-8831-8cb79e126f6e_4632x4713.png)

*Receiving feedback from people such as; previous users, startup experts, CEOs, designers, and others*

I received input from people interested in startups, general users providing objective opinions, startup founders, UI/UX experts, and foreign friends. They offered insights into my shortcomings in design, branding, and business direction, and provided me with new ideas. This broadened my perspective and helped me identify previously overlooked aspects. Surprisingly, I found myself inspired by their outside perspectives and useful feedback. Despite preparing for nearly a year, I realized my knowledge of the food tech market and the Webeing service was still lacking.

Some valuable insights provided to me included:

- The utilization of the landing page with regards to UI
- Whether or not it is necessary to categorize stores on the main page
- Whether or not consumers understand the service at a glance
- How to convince customers without strong branding
- The fact that consumers are less patient and less interested than was expected — a fact that should be considered in the future

These insights proved invaluable to me for prioritizing and setting criteria for future startup projects.

---

## The Bottom Line

Admittedly, we couldn't fully capitalize on our project. However, **the fact that it was actually used by people, rather than just remaining as a side project, is immensely gratifying.** We definitely learned valuable lessons.

This experience **doesn't feel like a failure.**

By focusing more on the consumer's perspective, we learned how product development and UI should be structured and executed. We now understand the importance of a solid preliminary process before development, including planning, design, and the overall workflow. This has been a very significant learning experience.

Currently, Webeing is nearing its end. While it's bittersweet, ingraining this process into my very being was so incredibly enriching for me. My understanding of product development roles has increased, which will help reduce mistakes in my future projects.

Product development is a crucial process. However, rather than rushing results, it's important to solidify development at the necessary stages. In essence, **planning and design must be solidified before development.**

![Photo by Kaleidico on Unsplash](https://substackcdn.com/image/fetch/$s_!mKbC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6ec56a0-baaf-4420-8017-414895229e0c_1400x933.webp)

*Photo by Kaleidico on Unsplash*

A strong idea must be planned thoroughly, one must meet as many consumers as possible, be capable of pivoting multiple times, and be able to determine what the company truly needs. Only then can design and development be solidified. **A firm foundation is essential for a service to be compelling when it enters the market.**

This is common advice, and readers have likely heard it countless times. I did too. But experiencing it firsthand has given me a clearer understanding of its necessity and validity, making it truly my own.

Developing a product is essential for startups. That's why I began studying it. Through studying, and actual real-life service development, I experienced the entire process of **'Planning — Design — Development — Test — Feedback'**. I understood the organic relationship between all stages, broadening my perspective and enabling me to see the big picture. Even if I don't continue as a startup CEO, and instead join a company, I won't just perform my assigned tasks. I will quickly grasp the overall picture and how my tasks fit into it. This will give me significant persuasive power in my work.

It's true that studying programming takes considerable time and effort. If you intend to pursue a career in software engineering, deep study is necessary. However, if you truly want to understand product development, experiencing a project or two offers great benefits. Continuing to study development, even if it's not your primary role, also provides substantial advantages. I recommend gaining experience based on what you value most.

I hope readers accumulate experience through various trials and errors and continue challenging the world. My own self-esteem has its ups and downs, but for my sake, and the world's, I will keep challenging myself. I'm not yet certain if product development is my true calling, but I will continue studying for future challenges. Besides this, I plan to study accounting, mathematics, design, management, and marketing.

**It won't be easy, but I believe it's worth it. This is my way of living the life I want, and that's why I will keep challenging myself.**
