from django.core.urlresolvers import reverse
from django.test import SimpleTestCase


class URLEndpointTestCase(SimpleTestCase):
    def test_get_root_view(self):
        url = reverse('homepage')

        response = self.client.get(url)

        self.assertEqual(200, response.status_code)

    def test_get_editor_view(self):
        url = reverse('editor')

        response = self.client.get(url)

        self.assertEqual(200, response.status_code)

    def test_get_publishing_view(self):
        url = reverse('upload_article')

        response = self.client.get(url)

        self.assertEqual(405, response.status_code)

    def test_post_publishing_all_required_fields(self):
        url = reverse('upload_article')

        response = self.client.post(url, data={
            'article': 'test content',
            'title': 'test title',
            'description': 'test description'
        })

        self.assertEqual(500, response.status_code)

    def test_post_publishing_missing_article(self):
        url = reverse('upload_article')

        response = self.client.post(url, data={
            'title': 'test title',
            'description': 'test description'
        })

        self.assertEqual(400, response.status_code)

    def test_post_publishing_empty_article(self):
        url = reverse('upload_article')

        response = self.client.post(url, data={
            'article': '',
            'title': 'test title',
            'description': 'test description'
        })

        self.assertEqual(500, response.status_code)

    def test_get_article_list_view(self):
        url = reverse('articles')

        response = self.client.get(url)

        self.assertEqual(200, response.status_code)

    def test_get_article_detail_view(self):
        url = reverse('article', args=(-1,))

        response = self.client.get(url)

        # 500 if service does not have the asked-for resource, otherwise it'll pass
        self.assertEqual(500, response.status_code)

    def test_get_search_view(self):
        url = reverse('articles')

        response = self.client.get(url)

        self.assertEqual(200, response.status_code)

    def test_get_about_view(self):
        url = reverse('articles')

        response = self.client.get(url)

        self.assertEqual(200, response.status_code)
