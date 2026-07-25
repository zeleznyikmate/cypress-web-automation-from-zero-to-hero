/// <reference types="cypress" />

it('first test', ()=>{
    cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
    cy.intercept({method: 'GET', pathname: 'tags'}, {fixture: 'tags.json'})
    cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
    cy.loginToApplication()
})

it('modify api response', ()=>{
    cy.intercept('GET', '**/articles*', req =>{
        req.continue( res =>{
            res.body.articles[0].favoritesCount = 9999999
            res.send(res.body)
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999')
})

it('waiting for apis', ()=>{
    cy.intercept('GET', '**/articles*').as('articleApiCall')
    cy.loginToApplication()
    cy.wait('@articleApiCall').then(apiArticleObject =>{
        console.log(apiArticleObject)
        expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
    })
    cy.get('app-article-list').invoke('text').then( allArticleTexts => {
        expect(allArticleTexts).to.contain('Bondar Academy')
    })
})

it.only('delete article', ()=>{
    cy.loginToApplication()
    
    cy.get('@accessToken').then(accessToken => {
        cy.request({
            url:'https://conduit-api.bondaracademy.com/api/articles/',
            method: 'POST',
            body: {
                "article": {
                    "title": "Test title Cypress",
                    "description": "Some description",
                    "body": "This is a body",
                    "tagList": []
                }
            },
            headers: {'Authorization': 'Token '+accessToken}
        }).then( response =>{
            expect(response.status).to.equal(201)
            expect(response.body.article.title).to.equal('Test title Cypress')
        })
    })
    
    cy.contains('Test title Cypress').click()
    cy.intercept('GET', '**/articles*').as('articleApiCall')
    cy.contains('button', 'Delete Article').first().click()
    cy.wait('@articleApiCall')
    cy.get('app-article-list').should('not.contain.text', 'Test title Cypress')
})

it('api testing', () => {
    cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/users/login',
        method: 'POST',
        body: {
            "user": {
            "email": "zeleznyik.mate@gmail.com",
            "password": "q4l-al0!"
            }
        }
    }).then(response => {
        expect(response.status).to.equal(200)
        const accessToken = 'Token ' + response.body.user.token

        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles/',
            method: 'POST',
            body: {
                "article": {
                "title": "Test title Cypress API Testing",
                "description": "Some description",
                "body": "This is a body",
                "tagList": []
                }
            },
            headers: {'Authorization': accessToken}
        }).then( response => {
            expect(response.status).to.equal(201)
            expect(response.body.article.title).to.equal('Test title Cypress API Testing')
        })

        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
            method: 'GET',
            headers: {'Authorization': accessToken}
        }).then( response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.equal('Test title Cypress API Testing')
            const slugID = response.body.articles[0].slug

            cy.request({
                url: `https://conduit-api.bondaracademy.com/api/articles/${slugID}`,
                method: 'DELETE',
                headers: {'Authorization': accessToken}
            }).then(response => {
                expect(response.status).to.equal(204)
            })
        })

        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
            method: 'GET',
            headers: {'Authorization': accessToken}
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.not.equal('Test title Cypress API Testing')
        })
    })
})
