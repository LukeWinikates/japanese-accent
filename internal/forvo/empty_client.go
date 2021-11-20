package forvo

type emptyClient struct {}

func EmptyClient() Client {
	return emptyClient{}
}

func (client emptyClient) GetPronunciations(_ string) ([]Pronunciation, error) {
	return make([]Pronunciation, 0), nil
}