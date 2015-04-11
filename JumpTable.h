//
//  JumpTable.h
//  nativeWu
//
//  Created by Sean Purcell on 4/10/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface JumpTable : UITableView <UITableViewDelegate, UITableViewDataSource>

-(void)setDataBlob:(NSDictionary*)blob;

@end
