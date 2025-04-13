'use client'

import Link from 'next/link'
import { Container, Heading, VStack, Card, CardHeader, CardBody, Text } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxWidth="container.2xl" py={12}>
      <VStack align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Sistema de Gestão Acadêmica
        </Heading>

        <Link href="/docentes" style={{ textDecoration: 'none' }}>
          <Card.Root
            variant="outline"
            _hover={{
              transform: 'scale(1.02)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              shadow: 'md',
            }}>
            <CardHeader>
              <Heading size="md">Área do Docente</Heading>
            </CardHeader>
            <CardBody>
              <Text>Acesse o sistema de gestão de docentes</Text>
            </CardBody>
          </Card.Root>
        </Link>
      </VStack>
    </Container>
  )
}
