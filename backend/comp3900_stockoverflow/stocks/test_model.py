from django.test import TestCase
from model_bakery import baker
from pprint import pprint

class TestIndustryModel(TestCase):
    def setUp(self):
        industry_list = ["Aerospace & Defense",
                        "Airlines",
                        "Auto Components",
                        "Automobiles",
                        "Banking",
                        "Basic Materials",
                        "Beverages",
                        "Biotechnology",
                        "Building",
                        "Chemicals",
                        "Commercial Services & Supplies",
                        "Communication Services",
                        "Construction",
                        "Consumer Cyclical",
                        "Consumer Defensive",
                        "Consumer products",
                        "Distributors",
                        "Diversified Consumer Services",
                        "Electrical Equipment",
                        "Energy",
                        "Financial Services",
                        "Food Products",
                        "Healthcare",
                        "Hotels, Restaurants & Leisure",
                        "Industrials",
                        "Insurance",
                        "Leisure Products",
                        "Life Sciences Tools & Services",
                        "Logistics & Transportation",
                        "Machinery",
                        "Marine",
                        "Media",
                        "Metals & Mining",
                        "Packaging",
                        "Paper & Forest",
                        "Pharmaceuticals",
                        "Professional Services",
                        "Real Estate",
                        "Retail",
                        "Road & Rail",
                        "Semiconductors",
                        "Services",
                        "Technology",
                        "Telecommunication",
                        "Textiles, Apparel & Luxury Goods",
                        "Tobacco",
                        "Trading Companies & Distributors",
                        "Transportation Infrastructure",
                        "Utilities"]

        for indusry in industry_list:
            self.industry_name = indusry
            self.save()