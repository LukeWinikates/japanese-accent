package forvo

import "context"

type emptyClient struct{}

func EmptyClient() Client {
	return emptyClient{}
}

func (client emptyClient) GetPronunciations(_ context.Context, _ string) ([]Pronunciation, error) {
	return make([]Pronunciation, 0), nil
}
