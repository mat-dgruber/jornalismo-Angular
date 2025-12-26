from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from blog.models import Post
from materiais.models import Material
from artigos.models import Artigo
from projetos.models import Projeto
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seeds the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Create Superuser
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write('Superuser created.')

        author = User.objects.first()

        # Clear existing Articles and Projects to avoid duplicates
        Artigo.objects.all().delete()
        Projeto.objects.all().delete()

        # Seed Articles from articles.ts
        articles_data = [
            {
                "title": "Fé para Amar o Próximo - Cristo Derruba Muros que Nunca Pediu que Fossem Levantados",
                "description": "Quantas vezes você já se pegou julgando alguém que não frequenta a mesma denominação religiosa que você? Algum costume diferente, modo de falar, vestir ou o que seja? Tenho certeza de que mesmo que você seja um cristão há muito tempo e entenda que essa atitude é errada, mesmo sem querer isso pode ter acontecido. Seguindo nessa linha de pensamento, hoje vamos analisar a história da mulher cananeia, encontrada em Mateus 15:21-28, um exemplo de fé em meio às adversidades.",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/fe-para-amar-o-proximo-cristo-derruba-muros-que-nunca-pediu-que-fossem-levantados"
            },
            {
                "title": "Fé Verdadeira: A Medida Perfeita para Mover Montanhas",
                "description": "Podem existir muitas dúvidas e questionamentos sobre como ter fé. Às vezes passamos por situações que fazem parecer que nossa fé é posta sob fogo. Temos dificuldade para confiar cegamente em Deus. <br>Cada um de nós pode possuir um “monte” ao qual tentamos mover, mas parece que ele nunca sairá do lugar. Então podemos perguntar: Qual a medida de fé necessária para que um monte se mova de um local a outro?",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/fe-verdadeira-a-medida-perfeita-para-mover-montanhas"
            },
            {
                "title": "Jesus é a Luz que Quem Insiste em Andar nas Trevas Ignora",
                "description": "Jesus mesmo sendo a luz do mundo, passou dificuldades para com um povo que andava em trevas e mesmo assim não conseguia ver a luz brilhar.<br> As dificuldades da vida de nosso Salvador foram muitas, mas algo que sem duvidas foi um destaque muito grande, é a questão das tribulações enfrentadas com os lideres religiosos em sua época que insistiam em o confrontar.",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/jesus-e-a-luz-que-quem-insiste-em-andar-nas-trevas-ignora"
            },
            {
                "title": "O Maior Tesouro Existente: O Amor",
                "description": "Quando estamos lendo a bíblia, descobrimos muitas coisas novas e às vezes, descobrimos coisas óbvias, mas que o nosso próprio “eu” deixou oculto em nosso interior. <br> Em Lucas 10:25-37 e Marcos 10:17-23, temos duas histórias que nos levam a refletir sobre o amor verdadeiro. Afinal, falamos tanto sobre o verdadeiro amor, mas será que apenas sabemos na teoria de que se trata, ou realmente vivemos esse tesouro precioso na prática?",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/o-maior-tesouro-existente-o-amor"
            },
            {
                "title": "A Importância de Crescer, mas Continuar a Ser como Criança",
                "description": "Quando somos mais novos, vemos a vida de forma diferente, tudo tem mais cor, tudo é mais simples, podemos chegar à conclusão de que para acabar com a guerra em países, basta um simples pedido de desculpas.Ao conviver com crianças podemos rir muito com as “pérolas” que podemos ouvir, elas podem não saber, mas tem o dom de deixar a vida mais leve.",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/a-importancia-de-crescer-mas-continuar-a-ser-como-crianca"
            },
            {
                "title": "Enxergando Além do Olhar Humano",
                "description": "Você conhece alguém que se transformou completamente depois de conhecer Jesus?Algumas vezes, conhecemos pessoas que nos contam como eram e o que faziam antes de Jesus e não conseguimos acreditar. Outras vezes, conhecemos pessoas antes do encontro com Jesus e não acreditamos que elas possam ser diferentes.",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/enxergando-alem-do-olhar-humano"
            },
            {
                "title": "Fragrância Eterna – A Salvação Divina é o Melhor Perfume",
                "description": "Alguma vez você já olhou para Jesus e sentiu que gostaria de fazer algo por Ele? Já teve vontade de honrar Jesus por nos ter perdoado de tantos pecados? Maria, em Lucas 7, nos ensina uma lição valiosa sobre atitude, arrependimento e devoção pessoal.",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/fragancia-eterna-a-salvacao-divina-e-o-melhor-perfume"
            },
            {
                "title": "O Primeiro Lugar no Reino dos Céus é o Último na Terra",
                "description": "Jesus foi o maior exemplo de humildade de todo o Universo, além de Se fazer homem e morrer por nossos pecados, nos ensinou lições valiosas sobre como agir como habitantes de seu Reino.<br> Em Mateus 23:11-12, Jesus nos ensina que o maior no Reino dos Céus é aquele que se faz servo de todos. Mas o que isso significa na prática? Como podemos aplicar esse ensinamento em nossas vidas hoje?",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/o-primeiro-lugar-no-reino-dos-ceus-e-o-ultimo-na-terra"
            },
            {
                "title": "Máscaras Ocultas – A maldição da figueira e a relação com a nossa vida espiritual",
                "description": "Você já leu alguma vez essa cena de Jesus e não entendeu de primeira o que aconteceu ali? No estudo de hoje vamos entender o motivo de tal ação de Jesus e a mensagem por trás dela.",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/mascaras-ocultas-a-maldicao-da-figueira"
            },
            {
                "title": "Preparação - Entendendo o passado, preparando-me no presente e estando pronto para o futuro",
                "description": "Frutos levam tempo para crescer: primeiro lança-se a semente na terra, depois ela fica escondida no sulco por um tempo, para só então crescer e gerar frutos que alimentarão aqueles que sentirem fome.<br> Da mesma forma, nossa preparação espiritual leva tempo e exige paciência. No estudo dessa semana, vamos refletir sobre o Sacrifício de Jesus e sua volta.",
                "source": "Projeto Lamed",
                "url": "https://lamed148.com.br/artigo/preparacao-passado-presente-futuro"
            }
        ]

        for art in articles_data:
            # Generate a safe slug manually
            from django.utils.text import slugify
            safe_slug = slugify(art['title'])[:50]
            
            Artigo.objects.create(
                titulo=art['title'],
                subtitulo=art['description'][:100] + '...',
                conteudo=art['description'],
                data_publicacao=timezone.now(),
                local_publicacao=art['source'],
                link_externo=art['url'],
                slug=safe_slug
            )
        self.stdout.write(f'{len(articles_data)} Articles created.')

        # Seed TCC Project
        Projeto.objects.create(
            titulo='FÉ SOB FOGO: UMA ANÁLISE TEOLÓGICA E GEOPOLÍTICA DA PERSEGUIÇÃO AOS CRISTÃOS E O DEVER DE INTERVENÇÃO DOS PAÍSES LIVRES',
            descricao="Este trabalho aborda tanto o desafio da perseguição a cristãos na China quanto em outros países ao redor do mundo, trazendo tanto análises sobre os motivos quanto possíveis soluções para tais ocorrências. Fé sob fogo: uma análise teológica e geopolítica da perseguição aos cristãos e o dever de intervenção dos países livres. Tal problemática consiste em diversas dificuldades que pessoas que professam a crença no cristianismo e sofrem por apenas crer no evangelho e na palavra de Jesus Cristo, também seguindo o tema, examina os deveres do Brasil enquanto país livre, para ajudá-los.",
            data_realizacao=timezone.now(),
            tipo='academico',
            link_externo='http://localhost:4200/projeto-tcc',
            slug='fe-sob-fogo-analise-teologica'
        )
        self.stdout.write('TCC Project created.')

        # Create Blog Posts
        if Post.objects.count() == 0:
            for i in range(1, 4):
                Post.objects.create(
                    title=f'Post do Blog {i}',
                    subtitle=f'Resumo do post {i}',
                    content=f'Conteúdo do post do blog {i}. ' * 15,
                    author=author,
                    published_date=timezone.now(),
                    slug=f'post-do-blog-{i}',
                    category='Geral'
                )
            self.stdout.write('Blog Posts created.')

        # Create Materials
        if Material.objects.count() == 0:
            for i in range(1, 4):
                Material.objects.create(
                    name=f'Material Exemplo {i}',
                    description=f'Descrição do material {i}.',
                    category='ebook',
                    type='gratuito',
                    price=0 if i % 2 == 0 else 19.99
                )
            self.stdout.write('Materials created.')

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
